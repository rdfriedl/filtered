/// <reference path="../node_modules/angular2/typings/browser.d.ts" />
/// <reference path="jquery/jquery.d.ts" />
/// <reference path="svgjs/svgjs.d.ts" />
/// <reference path="svg.filter.js/svg.filter.js.d.ts" />
/// <reference path="bootstrap/bootstrap.d.ts" />

declare function require(url: string):any
interface ArrayConstructor{
    from<T>(arrayLike:any,mapFn?:(element:any)=>void,thisArg?:any):Array<T>
}
interface Function{
    name:string;
}
interface Window{
    escape(string:any):string;
}
declare function Clipboard(element?:HTMLElement):void;
