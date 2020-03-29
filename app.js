'use strict';
const fs = require('fs');//Node.jsのモジュールのファイルシステムの呼び出し：ファイルを扱う
const readline = require('readline');//Node.jsのモジュールのreadlineの呼び出し:1行ずつ読み込む
const rs = fs.createReadStream('./popu-pref.csv');//csvファイルの読み込みを行うStreamの生成
const rl = readline.createInterface({ 'input': rs, 'output': {} });//readlineオブジェクトのinputとして設定，rlオブジェクトの作成
const prefactureDataMap = new Map();//key:都道府県，value:集計データのオブジェクト
rl.on('line', (lineString) =>{
  const columns = lineString.split(',');//引数として与えられたlineStringを,で区切って1行ずつcolumnsという名前の配列にした
  const year = parseInt(columns[0]);
  const prefacture = columns[1];
  const popu = parseInt(columns[3]);
  if(year === 2015 || year === 2010){
    let value = prefactureDataMap.get(prefacture);//Mapを使ってprefactureキーで対応する値呼び出すがまだ値を定義していない
    if(!value){
        value = {
            popu10: 0,
            popu15: 0,
            change: null
        };                                        //valueがfalse(undefnation)になった時データをこれにする
    } 
    if(year === 2010){
        value.popu10 = popu;
    }
    if(year === 2015){
        value.popu15 = popu;
    }
    prefactureDataMap.set(prefacture, value);//ここでMapの対応完成
   } 
});
rl.on('close', () =>{
    for(let　[key, value] of prefactureDataMap) {     //for of構文：MapやArrayの中身をkey,valueに代入．値が代入できればループ
        value.change = value.popu15 / value.popu10;
    }
    const rankingarray = Array.from(prefactureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;    
    });                                              //Array.from:Mapで登録したものを普通のArrayに直した
    const rankingStrings = rankingarray.map(([key, value]) =>{//map関数：arrayの要素に関数を適用したarrayを作る
        return key + ': ' + value.popu10 + '=>' + value.popu15 + '変化率' + value.change;
    });
    console.log(rankingStrings);                  //sort関数（比較関数）を呼んでソートをかけ
});