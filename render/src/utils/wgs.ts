// 定义坐标系椭球参数对象
let wgs84 = {
    a: 6378137,                     //长半径,单位m
    b: 6356752.3142451795,          //短半径
    f: 1/298.257223563,             //扁率
}
const square = num => num*num         //快速计算平方
let d2r = Math.PI / 180;            //弧度 = 角度 * Math.PI / 180

/*  
*   RE：Reference Ellipsoid（参考椭球体）
*   data: 一个存放数据的对象
*/  
function BLHtoXYZ (RE,data){
    let B = data.B;
    let L = data.L;
    let H = data.H;

    let e2 = (square(RE.a)-square(RE.b))/(square(RE.a));
    let N = RE.a/Math.sqrt(1-e2*square(Math.sin(B*d2r)));
    let X = (N+H)*Math.cos(B*d2r)*Math.cos(L*d2r);
    let Y = (N+H)*Math.cos(B*d2r)*Math.sin(L*d2r);
    let Z = (N*(1-e2)+H)*Math.sin(B*d2r);
    let result = {X:X,Y:Y,Z:Z};     //将结果保存到result对象中
    return result;
}

export default function index(B:number,L: number,H: number){
    const position = BLHtoXYZ(wgs84,{B,L,H})
    return position
}

export function translate(ratioString:string){
    const [d,m,s] = ratioString?.split(':')||[]
    const ratio = !!ratioString?(+d + +m/60 + +s/3600):0
    return ratio
}