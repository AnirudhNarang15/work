  let req=require("request");
  let ch= require("cheerio");
  let fs=require("fs");
req("https://www.espncricinfo.com/series/8048/scorecard/1237178/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-indian-premier-league-2020-21",urlans);
function urlans(err,res,html){
    //console.log(res.statusCode);
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
let output=selector("div.card.content-block.match-scorecard-table .Collapsible");
let count=0;
for (let i=0;i<output.length;i++) {
    let teamname= selector(output[i]).find("h5.header-title.label").text();
    console.log(teamname);
    let rowbatsman = selector(output[i]).find("table.table.batsman").find("tbody tr");//searching row of single batsman amd tr is row of table
    for(let j=0;j<rowbatsman.length;j++){
        let rowcol = selector(rowbatsman[j]).find("td")//td is coloumn of the table
        let isbatsman=selector(rowcol[0]).hasClass("batsman-cell");

        if(isbatsman==true){
          count++;
          let pname= selector(rowcol[0]).text();
          let run= selector(rowcol[2]).text();
           let balls= selector(rowcol[3]).text();
           let fours= selector(rowcol[5]).text();
           let sixes= selector(rowcol[6]).text();
           let sr= selector(rowcol[7]).text();
          console.log(`name: ${pname} Runs: ${run} Balls: ${balls} Four's:${fours} Six's:${sixes} Score rate:${sr}`);
        } 
    
    }

    console.log("no. of batsman in a team",count);
    count=0;        //used so that counter does not add with another table 
    console.log("''''''''''''''''''''''''''''''''''''''''''''''''''");

}
    
//fs.writeFileSync("innings.html",fullhtml);
}
