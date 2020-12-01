let req=require("request");
let ch= require("cheerio");
let fs=require("fs");
req("https://www.espncricinfo.com/series/8048/scorecard/1237181/delhi-capitals-vs-mumbai-indians-final-indian-premier-league-2020-21",urlans);
function urlans(err,res,html){
    console.log(res.statusCode);
   // if(err){
     //   console.log("some error",err);
// }
  //  else{
      //  fs.writeFileSync("ipl.html",html);
  //  }
    //loading html using cheerio
let selector=ch.load(html);
//using Variable output to search the required tag
//let output=selecter("div.summary"); //in () tags are inserted
//fs.writeFileSync("output.html",output.text());//text() = only words & html() = html portion
//console.log(output.html());
let output=selector("div.card.content-block.match-scorecard-table");
let fullhtml ="<table>";
for (let i=0;i<2;i++) {
    let tablebatsman = selector(output[i]).find("td.batsman-cell.text-truncate.out");
    
    fullhtml += selector(tablebatsman).html(); 
    fullhtml +="<table>";
    }
fs.writeFileSync("innings.html",fullhtml);
}



//*homework to print the name of all batsman