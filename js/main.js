"use strict";

var editor;
var svg = undefined;
var filter = undefined;
var previewText, previewImage;

// The Browser API key obtained from the Google Developers Console.
var pickerApiLoaded = false;
var picker;
var db;

var connectorPaintStyle = {
        lineWidth: 4,
        strokeStyle: "#485563",
        joinstyle: "round",
        outlineColor: "#2b3e50",
        outlineWidth: 2
    },
    connectorHoverStyle = {
        lineWidth: 4,
        strokeStyle: "#528705",
        outlineWidth: 2,
        outlineColor: "#2b3e50"
    },
    endpointHoverStyle = {
        fillStyle: "#7AB02C",
        strokeStyle: "#7AB02C"
    },
    outputEndPoint = {
        endpoint: "Dot",
        anchor: [0, 0],
        paintStyle: {
            strokeStyle: "#528705",
            fillStyle: "transparent",
            radius: 7,
            lineWidth: 3
        },
        isSource: true,
        connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
        connectorStyle: connectorPaintStyle,
        hoverPaintStyle: endpointHoverStyle,
        connectorHoverStyle: connectorHoverStyle,
        dragOptions: {},
        maxConnections: 100
    },
    inputEndPoint = {
        endpoint: "Dot",
        anchor: [0, 0],
        paintStyle: { fillStyle: "#528705", radius: 11 },
        hoverPaintStyle: endpointHoverStyle,
        maxConnections: 1,
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isTarget: true
    };

window.onApiLoad = function() {
    gapi.load('picker', {'callback': onPickerApiLoad});
}

window.onPickerApiLoad = function() {
    pickerApiLoaded = true;
    
    picker = new google.picker.PickerBuilder().
          addView(google.picker.ViewId.IMAGE_SEARCH).
          setCallback(pickerCallback).
          build();
}

function parseSearch(url){
    url = url || location.href;
    parseSearch.cache = parseSearch.cache || {};
    if(!parseSearch.cache[url]){
        var search = url.indexOf('?') !== -1? url.substr(url.indexOf('?')+1,url.length+1) : '';
        var queries = search.replace(/^\?/, '').replace(/\+/g,' ').split('&');
        parseSearch.cache[url] = {};
        for( var i = 0; i < queries.length; i++ ) {
            var split = queries[i].split('=');
            if(split[0] !== '') parseSearch.cache[url][split[0]] = window.unescape(split[1]);
        }
    }
    return parseSearch.cache[url];
}

function createSearch(data){
    var str = '';
    for(var i in data){
        if(data[i] == null || data[i] == undefined) continue;
        str += i + '=' + data[i] + '&';
    }
    str = str.substr(0,str.length-1);
    return str;
}

function formatXml(xml) {
    var reg = /(>)\s*(<)(\/*)/g; // updated Mar 30, 2015
    var wsexp = / *(.*) +\n/g;
    var contexp = /(<.+>)(.+\n)/g;
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
    var pad = 0;
    var formatted = '';
    var lines = xml.split('\n');
    var indent = 0;
    var lastType = 'other';
    var tab = '  '; //'\t';
    // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions 
    var transitions = {
        'single->single': 0,
        'single->closing': -1,
        'single->opening': 0,
        'single->other': 0,
        'closing->single': 0,
        'closing->closing': -1,
        'closing->opening': 0,
        'closing->other': 0,
        'opening->single': 1,
        'opening->closing': 0,
        'opening->opening': 1,
        'opening->other': 1,
        'other->single': 0,
        'other->closing': -1,
        'other->opening': 0,
        'other->other': 0
    };

    for (var i = 0; i < lines.length; i++) {
        var ln = lines[i];
        var single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
        var closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
        var opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
        var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
        var fromTo = lastType + '->' + type;
        lastType = type;
        var padding = '';

        indent += transitions[fromTo];
        for (var j = 0; j < indent; j++) {
            padding += tab;
        }
        if (fromTo == 'opening->closing')
            formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
        else
            formatted += padding + ln + '\n';
    }

    return formatted;
}

function initEditor(){
    svg = new SVG('preview-svg');
    filter = svg.filter();

    var desc = document.createElement('desc');
    desc.textContent = 'Created with Filtered | '+location.protocol+'//'+location.host+location.pathname;
    filter.node.appendChild(desc);

    var bbox = svg.bbox();

    previewText = svg.text('Text');
    previewText.font({
        size: '120px',
        'font-family': "'Ultra', serif"
    })
    previewText.filter(filter);

    previewImage = /*(new SVG.Image())*/svg.image().loaded(function(img){
        updateImageSize(img.width/img.height);
        updatePreviewPosition();
        page.editor.preview.mode.valueHasMutated()
    });
    previewImage.filter(filter);

    editor = jsPlumb.getInstance({
        // default drag options
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
        ConnectionOverlays: [
            [ "Arrow", { location: 1 } ]
        ],
        Container: "editor"
    });
}

function initDB(){
    db = new Dexie('Filtered');

    // Define a schema
    db.version(1)
        .stores({
            filters: '++id, name, saved, data'
        });

    // Open the database
    db.open()
        .catch(function(error){
            console.error('DB: ' + error);
        });
}

var pickerCallbackFunction = undefined;
function pickerCallback(data) {
    var url = '';
    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        var doc = data[google.picker.Response.DOCUMENTS][0];
        url = doc.thumbnails[doc.thumbnails.length-1][google.picker.Document.URL];
    }
    if(pickerCallbackFunction) pickerCallbackFunction(url);
}

function updatePreviewPosition(){
    var w = $('#preview-svg').width();
    var h = $('#preview-svg').height();
    previewText.center(w/2,h/2);
    previewImage.center(w/2,h/2);
}

function updateImageSize(r){
    var w = $(svg.node).width();
    var h = $(svg.node).height();
    var r = r || previewImage.width() / previewImage.height();

    if(w/h < r){
        previewImage.width(w);
        previewImage.height(w / r);
    }
    else{
        previewImage.width(h * r);
        previewImage.height(h);
    }
}

$(document).ready(function(){

    //show page on load
    $(window).load(function(){
        $('body').animate({'opacity':1},500);

        //animate zoom
        $('#editor').transition({
            scale: 0.1
        },0).transition({
            scale: 1
        },500)

        //show welcome messages
        if(!localStorage.welcome || parseSearch().welcome){
            $('#README').modal('show');
            localStorage.welcome = true;
        }
        else if(parseSearch().examples){
            $('#examples').modal('show');
        }
    })

    initEditor();
    initDB();
    editPosition.init();
    page.filters.update();

    // suspend drawing and initialise.
    editor.batch(function () {

        // make all the effect divs draggable
        editor.draggable(jsPlumb.getSelector("#editor .effect"));

        editor.bind('connection',function(info){
            if(info.targetEndpoint.getParameter('this') instanceof EffectInput){
                info.targetEndpoint.getParameter('this').connectionEvent(info.sourceEndpoint.getParameter('this'));
            }
            page.editor.arange();
            page.filters.saved(false);
        })

        editor.bind('connectionDetached',function(info){
            if(info.targetEndpoint.getParameter('this') instanceof EffectInput){
                info.targetEndpoint.getParameter('this').connectionDetachedEvent();
            }
            page.editor.arange();
            page.filters.saved(false);
        })

        editor.bind('connectionMoved',function(info){
            if(info.originalTargetEndpoint.getParameter('this') instanceof EffectInput){
                info.originalTargetEndpoint.getParameter('this').connectionDetachedEvent();
            }
            if(info.newTargetEndpoint.getParameter('this') instanceof EffectInput){
                info.newTargetEndpoint.getParameter('this').connectionDetachedEvent(info.newSourceEndpoint.getParameter('this'));
            }
            // page.editor.arange(); dont need to arange
            page.filters.saved(false);
        })

        editor.repaintEverything();

        //load filter after editor loads
        page.editor.start(function(){
            page.loadFilter();
            page.loadSearch();
        });
    });

    $(document).on('click','[href="#"]',function(event){
        event.preventDefault();
    })

    $('.panel-heading a[data-toggle="collapse"]').parent().parent().click(function(){
        $($(this).find('a[data-toggle="collapse"]').attr('href')).collapse('toggle');
    });

    //zoom
    // $('.editor-controls').mousewheel(function(event){
    //     var oldZoom = page.editor.zoom.zoomLevel();
    //     if(event.deltaY > 0){
    //         page.editor.zoom.zoomIn();
    //     }
    //     else{
    //         page.editor.zoom.zoomOut();
    //     }
    //     var zoom = page.editor.zoom.zoomLevel();

    //     //zoom to cursor
    //     $('#editor').css({
    //         x: parseFloat($('#editor').css('x').replace('px','')) + (((window.outerWidth*oldZoom) - (window.outerWidth*zoom))/2)*((event.pageX - window.outerWidth/2) / (window.outerWidth/2)),
    //         y: parseFloat($('#editor').css('y').replace('px','')) + (((window.outerHeight*oldZoom) - (window.outerHeight*zoom))/2)*((event.pageY - window.outerHeight/2) / (window.outerHeight/2))
    //     })
    // })

    //pan
    var startOffset, pos, startPos, dragging;
    $('.editor-controls').mousedown(function(event){
        startPos = {
            x: parseFloat($('#editor').css('x').slice(0,-2)),
            y: parseFloat($('#editor').css('y').slice(0,-2))
        };
        startOffset = {
            x: event.pageX,
            y: event.pageY
        }
        dragging = true;
    }).mousemove(function(event){
        if(dragging){
            $('#editor').css({
                x: startPos.x + (event.pageX - startOffset.x),
                y: startPos.y + (event.pageY - startOffset.y)
            })
            $('.editor-controls').css('cursor','move');
        }
    }).mouseup(function(event){
        dragging = false;
        $('.editor-controls').css('cursor','default');
    })

    $('#center-view').click(function(){
        $('#editor').animate({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        })
    })

    //set the transforms order
    $('#editor').css({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        scale: 1
    })

    //copy
    $(".copy").each(function(i,el){
        new ZeroClipboard(el);
    });

    $(document).on('click','input[type="image"]',function(){
        pickerCallbackFunction = function(url){
            $(this).val(url).trigger('change');
        }.bind(this);
        pickerApiLoaded && picker.setVisible(true);
    })

    $(window).resize(function(){
        updatePreviewPosition();
        editor.repaintEverything();
    })
    $(window).trigger('resize');

    $(window).on('beforeunload',function(){
        if(!page.filters.saved()){
            return ''
        }
    })
});

SVG.Filter.prototype.put = function(element, i) {
    this.add(element, i)
    
    if(!element.attr('result')){
        element.attr('result',element);
    }
    
    return element;
}