import 'svg.js';
import 'svg.filter.js';
import Clipboard from 'clipboard';

import {parseSearch} from './util.js';
import DataBase from './dataBase.js';
import page from './page.js';
import Editor from './editor.js';
import Preview from './preview.js';

import * as inputs from './effects/inputs.js';
import * as outputs from './effects/outputs.js';

window.editor =
    window.svg =
    window.filter =
    window.previewText =
    window.previewImage =
    window.previewFilter = undefined;

// The Browser API key obtained from the Google Developers Console.
var pickerApiLoaded = false;
var picker;

window.onPickerApiLoad = function() {
    pickerApiLoaded = true;

    picker = new google.picker.PickerBuilder().
          addView(google.picker.ViewId.IMAGE_SEARCH).
          setCallback(pickerCallback).
          build();
};

window.onApiLoad = function() {
    gapi.load('picker', {'callback': window.onPickerApiLoad});
};

window.createSearch = function createSearch(data){
    var str = '';
    for(var i in data){
        if(data[i] === null || data[i] === undefined) continue;
        str += i + '=' + data[i] + '&';
    }
    str = str.substr(0,str.length-1);
    return str;
}

window.formatXml = function formatXml(xml) {
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

window.initEditor = function initEditor(){
    page.editor.bind();

    $(Preview.inst.element).appendTo('#top-right');
    Preview.inst.init(Editor.inst);
    Editor.inst.init();

    svg = Preview.inst.svg;

    previewText = svg.text('Text');
    previewText.font({
        size: '120px',
        'font-family': "'Ultra', serif"
    });
    previewText.filter(filter);

    previewImage = /*(new SVG.Image())*/svg.image().loaded(function(img){
        updateImageSize(img.width/img.height);
        updatePreviewPosition();
        page.editor.preview.mode.valueHasMutated();
    });
    previewImage.filter(filter);
}

window.pickerCallback = function pickerCallback(data) {
    var url = '';
    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        var doc = data[google.picker.Response.DOCUMENTS][0];
        url = doc.thumbnails[doc.thumbnails.length-1][google.picker.Document.URL];
    }
    if(window.pickerCallbackFunction) window.pickerCallbackFunction(url);
}

window.updatePreviewPosition = function updatePreviewPosition(){
    var w = $('#preview-svg').width();
    var h = $('#preview-svg').height();
    previewText.center(w/2,h/2);
    previewImage.center(w/2,h/2);
}

window.updateImageSize = function updateImageSize(r){
    var w = $(svg.node).width();
    var h = $(svg.node).height();
    r = r || previewImage.width() / previewImage.height();

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
        },500);

        //show welcome messages
        if(!localStorage.welcome || parseSearch().welcome){
            $('#README').modal('show');
            localStorage.welcome = true;
        }
        else if(parseSearch().examples){
            $('#examples').modal('show');
        }
    });

    initEditor();
    DataBase.inst.init();
    // editPosition.init.call(editPosition);
    page.filters.update();

    //load filter after editor loads
    page.editor.start(function(){
        page.loadFilter();
        page.loadSearch();
    });

    console.info('editor started');

    $(document).on('click','[href="#"]',function(event){
        event.preventDefault();
    });

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
    var startOffset, startPos, dragging;
    $('.editor-controls').mousedown(function(event){
        if(!$(event.target).is('input')){
            startPos = {
                x: parseFloat($('#editor').css('x').slice(0,-2)),
                y: parseFloat($('#editor').css('y').slice(0,-2))
            };
            startOffset = {
                x: event.pageX,
                y: event.pageY
            };
            dragging = true;
        }
    }).mousemove(function(event){
        if(dragging){
            $('#editor').css({
                x: startPos.x + (event.pageX - startOffset.x),
                y: startPos.y + (event.pageY - startOffset.y)
            });
            $('.editor-controls').css('cursor','move');
        }
    }).mouseup(function(){
        dragging = false;
        $('.editor-controls').css('cursor','default');
    });

    $('#center-view').click(function(){
        var minX, minY, maxX, maxY;
        $('#editor').children('.effect').each(function(i,el){
            var left = parseFloat($(el).css('left').replace('px',''));
            var top = parseFloat($(el).css('top').replace('px',''));
            var width = $(el).width();
            var height = $(el).height();

            minX = minX == undefined? (left) : Math.min(minX, left);
            minY = minY == undefined? (top) : Math.min(minY, top);
            maxX = maxX == undefined? (left + width) : Math.max(maxX, left + width);
            maxY = maxY == undefined? (top + height) : Math.max(maxY, top + height);
        });
        $('#editor').animate({
            x: -(minX + (maxX - minX)/2) + window.innerWidth/2,
            y: -(minY + (maxY - minY)/2) + window.innerHeight/2
        });
    });

    //set the transforms order
    $('#editor').css({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        scale: 1
    });

    //copy
    new Clipboard('.copy');

    $(document).on('click','input[type="image"]',function(){
        pickerCallbackFunction = function(url){
            $(this).val(url).trigger('change');
        }.bind(this);
        if(window.pickerApiLoaded) picker.setVisible(true);
    });

    $(window).resize(function(){
        updatePreviewPosition();
        editor.repaintEverything();
    });
    $(window).trigger('resize');

    $(window).on('beforeunload',function(){
        if(!page.filters.saved()){
            return '';
        }
    });
});

SVG.Filter.prototype.put = function(element, i) {
    this.add(element, i);

    if(!element.attr('result')){
        element.attr('result',element);
    }

    return element;
};
