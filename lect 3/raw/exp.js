let req=require("request");
let ch= require("cheerio");
let fs=require("fs");
req("http://www.bpitindia.com/electrical-and-electronics-engineering-faculty-profile.html",finding);
function finding(err,res,html){
    console.log(res.statusCode);
    let tool=ch.load(html);
    let output = tool("div.blog-detail-content.pb20")
    let file = "<table>";
    for (let i = 0; i < output.length; i++) {
        let name=tool(output[i]).find("div.member_info").text();
        file+=name[i];
        let rowteach = tool(output[i]).find("table.table.table-bordered.table-responsive").find("tbody");
        //let details=tool(output[i]).find(".col-md-8.col-sm-6.col-xs-12.martop").text();  
        console.log(name);
       for(let j=0;j<rowteach.length;j++){
         let qualification = tool(rowteach[j]).html();
         //let rowcol = tool(rowteach[j]).find("td")
         
         //console.log(qualification + name);
         file += qualification; 
         file += "<table>";
         fs.writeFileSync("details.html",file);
       }
    }
   //fs.writeFileSync("details.html",name + details);
    
}
