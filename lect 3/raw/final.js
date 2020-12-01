let req=require("request");          //npm install request,cheerio,xlsx 
let ch= require("cheerio");
let fs=require("fs");
let path=require("path");
let xlsx=require("xlsx");
req("https://www.espncricinfo.com/series/_/id/8048/season/2020/indian-premier-league",jumpto)
function jumpto(error,res,html){       //function to jump from home page to result table
    let stool = ch.load(html);
    let output = stool("a[data-hover='View All Results']")
    let href=stool(output).attr("href");
    let furl="https://www.espncricinfo.com"+href;
    //console.log(furl);
    matchingurl(furl);
}
function matchingurl(url){                 //function to extract url of scorecards and put in dataofmatch function
    req(url,allmatchurl);
function allmatchurl(err,res,html){
 let stool = ch.load(html);
 let matchurlelem=stool("a[data-hover='Scorecard']");//for finding attributes a[name="classname"]
 for (let i = 0; i < matchurlelem.length; i++) {
     let href= stool(matchurlelem[i]).attr("href");
     let furl="https://www.espncricinfo.com"+href;
     dataofmatch(furl);
     }

}
}
function dataofmatch(url){                 //to extract team ,name,runs,balls etc of one match 
req(url,urlans);
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
//let fullxlsx="<table>";
for (let i=0;i<output.length;i++) {
    let teamname= selector(output[i]).find("h5.header-title.label").text();
    let teamnamestr=teamname.split("Innings");//split is used to substring the string to take out first three lines before innings
    teamname=teamnamestr[0].trim();
    let rowbatsman = selector(output[i]).find("table.table.batsman").find("tbody tr");//searching row of single batsman amd tr is row of table
    for(let j=0;j<rowbatsman.length;j++){
        let rowcol = selector(rowbatsman[j]).find("td")//td is coloumn of the table
        let isbatsman=selector(rowcol[0]).hasClass("batsman-cell");

        if(isbatsman==true){
          count++;
          let pname= selector(rowcol[0]).text();
          let name=pname.split("†");
          pname=name[0].trim();
          let run= selector(rowcol[2]).text().trim();
           let balls= selector(rowcol[3]).text().trim();
           let fours= selector(rowcol[5]).text().trim();
           let sixes= selector(rowcol[6]).text().trim();
           let sr= selector(rowcol[7]).text().trim();
           //console.log(`name: ${pname} Runs: ${run} Balls: ${balls} Four's:${fours} Six's:${sixes} Score rate:${sr}`);
          processPlayer(teamname,pname,run,balls,fours,sixes,sr);
        } 
    
    }

    //console.log("no. of batsman in a team",count);
    count=0;        //used so that counter does not add with another table 
    //console.log("''''''''''''''''''''''''''''''''''''''''''''''''''");

}
    }
}
function processPlayer(team,name,runs,balls,fours,sixes,sr){    //to make a folder of teams and players and write the data individually
let pmatchstats={
        Team:team,
        Name:name,
        Runs:runs,
        Balls:balls,
        Fours:fours,
        Sixes:sixes,
        Scorerate:sr
    }
 if (fs.existsSync(team)) {
 }else{
     fs.mkdirSync(team);
 }
 let playerfilepath=path.join(team,name+".xlsx");
 let pdata=[];
 if(fs.existsSync(playerfilepath)){ 
    // pdata=require(`./${playerfilepath}`);
    pdata=excelreader(playerfilepath,name);
    pdata.push(pmatchstats);
 }else{
     //create file
     pdata=[pmatchstats];
     //fs.writeFileSync(playerfilepath,JSON.stringify(pdata));
     console.log("File of player",playerfilepath,"created");
 }
 excelwriter(playerfilepath,pdata,name);
}
function excelreader(filepath,name){                //to read details in excel format
    if(!fs.existsSync(filepath)){
        return null;
    }else{
         let wt=xlsx.readFile(filepath);
         let exceldata=wt.Sheets[name];
         let ans = xlsx.utils.sheet_to_json(exceldata);
         return ans;
    }
    
}
function excelwriter(filepath,json,name){           //to write details in excel
    let newwb=xlsx.utils.book_new();
    let newws=xlsx.utils.sheet_to_json(json);
    xlsx.utils.book_append_sheet(newwb,newws,name);
    xlsx.writeFile(newwb,filepath);
}