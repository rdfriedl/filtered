var editor;
var svg = undefined;
var filter = undefined;
var previewText, previewImage;

// The Browser API key obtained from the Google Developers Console.
var pickerApiLoaded = false;
var picker;

var connectorPaintStyle = {
        lineWidth: 4,
        strokeStyle: "#485563",
        joinstyle: "round",
        outlineColor: "#2b3e50",
        outlineWidth: 3
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
        maxConnections: -1,
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isTarget: true,
        maxConnections: 1
    };

function onApiLoad() {
    gapi.load('picker', {'callback': onPickerApiLoad});
}

function onPickerApiLoad() {
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
        for( i = 0; i < queries.length; i++ ) {
            split = queries[i].split('=');
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

    previewImage = svg.image('').loaded(function(img){
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

function pickerCallback(data) {
    var url = '';
    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        var doc = data[google.picker.Response.DOCUMENTS][0];
        url = doc.thumbnails[doc.thumbnails.length-1][google.picker.Document.URL];
    }
    page.editor.preview.image.url(url);
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

    initEditor();
    editPosition.init();

    // suspend drawing and initialise.
    editor.batch(function () {

        // make all the effect divs draggable
        editor.draggable(jsPlumb.getSelector("#editor .effect"));

        editor.bind('connection',function(info){
            if(info.targetEndpoint.getParameter('this') instanceof EffectInput){
                info.targetEndpoint.getParameter('this').connectionEvent(info.sourceEndpoint.getParameter('this'));
            }
            page.editor.arange();
        })

        editor.bind('connectionDetached',function(info){
            if(info.targetEndpoint.getParameter('this') instanceof EffectInput){
                info.targetEndpoint.getParameter('this').connectionDetachedEvent();
            }
            page.editor.arange();
        })

        editor.bind('connectionMoved',function(info){
            if(info.originalTargetEndpoint.getParameter('this') instanceof EffectInput){
                info.originalTargetEndpoint.getParameter('this').connectionDetachedEvent();
            }
            if(info.newTargetEndpoint.getParameter('this') instanceof EffectInput){
                info.newTargetEndpoint.getParameter('this').connectionDetachedEvent(info.newSourceEndpoint.getParameter('this'));
            }
            // page.editor.arange(); dont need to arange
        })

        editor.repaintEverything();

        //load filter after editor loads
        page.editor.start();
        page.loadFilter();
        page.loadSearch();
    });

    $(document).on('click','[href="#"]',function(event){
        event.preventDefault();
    })

    $('.panel-heading a[data-toggle="collapse"]').parent().parent().click(function(){
        $($(this).find('a').attr('href')).collapse('toggle');
    });

    //zoom
    var editorScale = 1;
    $('.editor-controls').mousewheel(function(event){
        if(event.deltaY > 0){
            page.editor.zoom.zoomIn();
        }
        else{
            page.editor.zoom.zoomOut();
        }
    })

    //copy
    $(".copy").each(function(i,el){
        new ZeroClipboard(el);
    });

    $(window).resize(function(){
        updatePreviewPosition();
        editor.repaintEverything();
    })
    $(window).trigger('resize');
});

SVG.Filter.prototype.put = function(element, i) {
    this.add(element, i)
    
    if(!element.attr('result')){
        element.attr('result',element);
    }
    
    return element;
}