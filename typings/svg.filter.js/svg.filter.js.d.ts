declare namespace svgjs {
    export interface Library{
        Filter():void;
    }
    export interface Filter extends svgjs.Parent{
        source:string;
        sourceAlpha:string;
        background:string;
        backgroundAlpha:string;
        fill:string;
        stroke:string;

        autoSetIn:boolean;
        toString():string;
    }
    interface _filter{
        filter(block?:(filter:Filter)=>void):Filter;
    }
    interface _unfilter{
        unfilter(remove?:boolean):this;
    }
    export interface Container extends _filter{}
    export interface Element extends _filter,_unfilter{}
    export interface Nested extends _filter,_unfilter{}
    export interface Defs extends _filter{}
    export interface G extends _filter,_unfilter{}

    interface chainEffect{}
    interface in2{
        in2():any;
        in2():Effect;
        in2(attr:string):this;
        in2(effect:Effect):this;
    }

    export interface Effect extends svgjs.Element,chainEffect{
        in():Effect;
        in(effect:Effect):this;
        result():string;
        result(result:string):this;
        result(result:Effect):this;
        toString():string;
    }
    export interface Library{Effect():void}

    export interface ParentEffect extends svgjs.Parent,Effect,chainEffect{}
    export interface Library{ParentEffect():void}

    export interface ChildEffect extends svgjs.Element{
        in():Effect;
        in(effect:Effect):this;
    }
    export interface Library{ChildEffect():void}

    // presets
    export interface Library{
        filter:{
            sepiatone:Array<Array<number>>
        }
    }

    //effects
    export interface BlendEffect extends Effect,in2{(in1?:string|Effect, in2?:string|Effect, mode?:string):BlendEffect;}
    interface chainEffect{blend(in2?:string|Effect, mode?:string):BlendEffect;}
    interface Filter{blend(in1?:string|Effect, in2?:string|Effect, mode?:string):BlendEffect;}
    interface Library{BlendEffect(in1?:string|Effect, in2?:string|Effect, mode?:string):void;}

    export interface ColorMatrixEffect extends Effect{(type?:string, values?:any):ColorMatrixEffect;}
    interface chainEffect{colorMatrix(type?:string, values?:any):ColorMatrixEffect;}
    interface Filter{colorMatrix(type?:string, values?:any):ColorMatrixEffect;}
    interface Library{ColorMatrixEffect(type?:string, values?:any):void;}

    export interface ConvolveMatrixEffect extends Effect{(matrix?:string|number[]):ConvolveMatrixEffect;}
    interface chainEffect{convolveMatrix(matrix?:string|number[]):ConvolveMatrixEffect;}
    interface Filter{convolveMatrix(matrix?:string|number[]):ConvolveMatrixEffect;}
    interface Library{ConvolveMatrixEffect(matrix?:string|number[]):void;}

    export interface CompositeEffect extends Effect,in2{(in1?:string|Effect, in2?:string|Effect, operator?:string):CompositeEffect;}
    interface chainEffect{composite(in2?:string|Effect, operator?:string):CompositeEffect;}
    interface Filter{composite(in1?:string|Effect, in2?:string|Effect, operator?:string):CompositeEffect;}
    interface Library{CompositeEffect(in1?:string|Effect, in2?:string|Effect, operator?:string):void;}

    export interface FloodEffect extends Effect{(color?:any,opacity?:number):FloodEffect;}
    interface chainEffect{flood(color?:any,opacity?:number):FloodEffect;}
    interface Filter{flood(color?:any,opacity?:number):FloodEffect;}
    interface Library{FloodEffect(color?:any,opacity?:number):void;}

    export interface OffsetEffect extends Effect{(x?:number, y?:number):OffsetEffect;}
    interface chainEffect{offset(x?:number, y?:number):OffsetEffect;}
    interface Filter{offset(x?:number, y?:number):OffsetEffect;}
    interface Library{OffsetEffect(x?:number, y?:number):void;}

    export interface ImageEffect extends Effect{(src?:string):ImageEffect;}
    interface chainEffect{image(src?:string):ImageEffect;}
    interface Filter{image(src?:string):ImageEffect;}
    interface Library{ImageEffect(src?:string):void;}

    export interface DisplacementMapEffect extends Effect,in2{(in1?:string|Effect, in2?:string|Effect, scale?:number, xChannelSelector?:string, yChannelSelector?:string):DisplacementMapEffect;}
    interface chainEffect{displacementMap(in2?:string|Effect, scale?:number, xChannelSelector?:string, yChannelSelector?:string):DisplacementMapEffect;}
    interface Filter{displacementMap(in1?:string|Effect, in2?:string|Effect, scale?:number, xChannelSelector?:string, yChannelSelector?:string):DisplacementMapEffect;}
    interface Library{DisplacementMapEffect(in1?:string|Effect, in2?:string|Effect, scale?:number, xChannelSelector?:string, yChannelSelector?:string):void;}

    export interface GaussianBlurEffect extends Effect{(x?:number, y?:number):GaussianBlurEffect;}
    interface chainEffect{gaussianBlur(x?:number, y?:number):GaussianBlurEffect;}
    interface Filter{gaussianBlur(x?:number, y?:number):GaussianBlurEffect;}
    interface Library{GaussianBlurEffect(x?:number, y?:number):void;}

    export interface MorphologyEffect extends Effect{(operator?:string, radius?:number):MorphologyEffect;}
    interface chainEffect{morphology(operator?:string, radius?:number):MorphologyEffect;}
    interface Filter{morphology(operator?:string, radius?:number):MorphologyEffect;}
    interface Library{MorphologyEffect(operator?:string, radius?:number):void;}

    export interface TileEffect extends Effect{():TileEffect;}
    interface chainEffect{tile():TileEffect;}
    interface Filter{tile():TileEffect;}
    interface Library{TileEffect():void;}

    export interface TurbulenceEffect extends Effect{(baseFrequency?:any, numOctaves?:number, seed?:any, stitchTiles?:string, type?:string):TurbulenceEffect;}
    interface chainEffect{turbulence(baseFrequency?:any, numOctaves?:number, seed?:any, stitchTiles?:string, type?:string):TurbulenceEffect;}
    interface Filter{turbulence(baseFrequency?:any, numOctaves?:number, seed?:any, stitchTiles?:string, type?:string):TurbulenceEffect;}
    interface Library{TurbulenceEffect(baseFrequency?:any, numOctaves?:number, seed?:any, stitchTiles?:string, type?:string):void;}

    // parentEffects
    export interface MergeEffect extends Effect{
        (effects:svgjs.Set):MergeEffect;
        (effects:Array<string|Effect>):MergeEffect;
        (...effects:Array<string|Effect>):MergeEffect;
    }
    interface chainEffect{
        merge(effects:svgjs.Set):MergeEffect;
        merge(effects:Array<string|Effect>):MergeEffect;
        merge(...effects:Array<string|Effect>):MergeEffect;
    }
    interface Filter{
        merge(effects:svgjs.Set):MergeEffect;
        merge(effects:Array<string|Effect>):MergeEffect;
        merge(...effects:Array<string|Effect>):MergeEffect;
    }
    interface Library{
        MergeEffect(effects:svgjs.Set):void;
        MergeEffect(effects:Array<string|Effect>):void;
        MergeEffect(...effects:Array<string|Effect>):void;
    }

    interface ComponentTransferEffectComponent{
        type?:string;
        tableValues?:number[]|string;
        slope?:number;
        intercept?:number;
        amplitude?:number;
        exponent?:number;
        offset?:number;
    }
    interface ComponentTransferEffectComponents{
        rgb?: ComponentTransferEffectComponent;
        r?: ComponentTransferEffectComponent;
        g?: ComponentTransferEffectComponent;
        b?: ComponentTransferEffectComponent;
        a?: ComponentTransferEffectComponent;
    }
    export interface ComponentTransferEffect extends ParentEffect{(components?: ComponentTransferEffectComponents):ComponentTransferEffect;}
    interface chainEffect{componentTransfer(components?: ComponentTransferEffectComponents):ComponentTransferEffect;}
    interface Filter{componentTransfer(components?: ComponentTransferEffectComponents):ComponentTransferEffect;}
    interface Library{ComponentTransferEffect(components?: ComponentTransferEffectComponents):void;}

    export interface DiffuseLightingEffect extends ParentEffect{(surfaceScale?:number, diffuseConstant?:number, kernelUnitLength?:string|any):DiffuseLightingEffect;}
    interface chainEffect{diffuseLighting(surfaceScale?:number, diffuseConstant?:number, kernelUnitLength?:string|any):DiffuseLightingEffect;}
    interface Filter{diffuseLighting(surfaceScale?:number, diffuseConstant?:number, kernelUnitLength?:string|any):DiffuseLightingEffect;}
    interface Library{DiffuseLightingEffect(surfaceScale?:number, diffuseConstant?:number, kernelUnitLength?:string|any):void;}

    export interface SpecularLightingEffect extends ParentEffect{(surfaceScale?:number, diffuseConstant?:number, specularExponent?: number, kernelUnitLength?:string|any):SpecularLightingEffect;}
    interface chainEffect{specularLighting(surfaceScale?:number, diffuseConstant?:number, specularExponent?: number, kernelUnitLength?:string|any):SpecularLightingEffect;}
    interface Filter{specularLighting(surfaceScale?:number, diffuseConstant?:number, specularExponent?: number, kernelUnitLength?:string|any):SpecularLightingEffect;}
    interface Library{SpecularLightingEffect(surfaceScale?:number, diffuseConstant?:number, specularExponent?: number, kernelUnitLength?:string|any):void;}

    // childEffects
    export interface DistantLight extends ChildEffect{(azimuth, elevation):DistantLight;}
    export interface PointLight extends ChildEffect{(x?:number, y?:number, z?:number):PointLight;}
    export interface SpotLight extends ChildEffect{(x?:number, y?:number, z?:number, pointAtX?:number, pointAtY?:number, pointAtZ?:number):SpotLight;}
    export interface MergeNode extends ChildEffect{(in1?:Effect|string):MergeNode;}
}
