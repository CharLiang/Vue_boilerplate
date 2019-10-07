/**
 * Created by liuzhq on 2018/6/21.
 */

function wordExport(pages){
  var pageDoc = ""
  for (var i=0; i<pages.length; i++) {
    var page = pages[i].replace(/\n/g,"<br/>")
    pageDoc += '<div class="msochpdefault">' + page + '</div><br/><br/>' +
      `<w:p>
        <w:r> 
          <w:br w:type="page">
        </w:r> 
      </w:p>`
  }
  var content = pageDoc
  pageDoc = `<html xmlns:v="urn:schemas-microsoft-com:vml"  
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:w="urn:schemas-microsoft-com:office:word"
  xmlns:m="http://schemas.microsoft.com/office/2004/12/omml
  xmlns="http://www.w3.org/TR/REC-html40">`
  pageDoc += `<head>
    <meta http-equiv=Content-Type content="text/html; charset=UTF-8"> 
    <!--[if gte mso 9]><xml>  
     <w:WordDocument>  
      <w:View>Print</w:View>  
      <w:GrammarState>Clean</w:GrammarState>  
      <w:TrackMoves>false</w:TrackMoves>  
      <w:TrackFormatting/>  
      <w:ValidateAgainstSchemas/>  
      <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>  
      <w:IgnoreMixedContent>false</w:IgnoreMixedContent>  
      <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>  
      <w:DoNotPromoteQF/>  
      <w:LidThemeOther>EN-US</w:LidThemeOther>  
      <w:LidThemeAsian>ZH-CN</w:LidThemeAsian>  
      <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>  
      <w:Compatibility>  
       <w:BreakWrappedTables/>  
       <w:SnapToGridInCell/>  
       <w:WrapTextWithPunct/>  
       <w:UseAsianBreakRules/>  
       <w:DontGrowAutofit/>  
       <w:SplitPgBreakAndParaMark/>  
       <w:DontVertAlignCellWithSp/>  
       <w:DontBreakConstrainedForcedTables/>  
       <w:DontVertAlignInTxbx/>  
       <w:Word11KerningPairs/>  
       <w:CachedColBalance/>  
       <w:UseFELayout/>  
      </w:Compatibility>  
      <w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel>  
      <m:mathPr>  
       <m:mathFont m:val="Cambria Math"/>  
       <m:brkBin m:val="before"/>  
       <m:brkBinSub m:val="--"/>  
       <m:smallFrac m:val="off"/>  
       <m:dispDef/>  
       <m:lMargin m:val="0"/>  
       <m:rMargin m:val="0"/>  
       <m:defJc m:val="centerGroup"/>  
       <m:wrapIndent m:val="1440"/>  
       <m:intLim m:val="subSup"/>  
       <m:naryLim m:val="undOvr"/>  
      </m:mathPr></w:WordDocument>  
    </xml><![endif]-->  
    <style> 
       @font-face  
    {font-family:宋体;  
    panose-1:2 1 6 0 3 1 1 1 1 1;  
    mso-font-alt:SimSun;  
    mso-font-charset:134;  
    mso-generic-font-family:auto;  
    mso-font-pitch:variable;  
    mso-font-signature:3 680460288 22 0 262145 0;}  
@font-face  
    {font-family:"Cambria Math";  
    panose-1:2 4 5 3 5 4 6 3 2 4;  
    mso-font-charset:1;  
    mso-generic-font-family:roman;  
    mso-font-format:other;  
    mso-font-pitch:variable;  
    mso-font-signature:0 0 0 0 0 0;}  
@font-face  
    {font-family:"\@宋体";  
    panose-1:2 1 6 0 3 1 1 1 1 1;  
    mso-font-charset:134;  
    mso-generic-font-family:auto;  
    mso-font-pitch:variable;  
    mso-font-signature:3 680460288 22 0 262145 0;}  
 /* Style Definitions */  
 p.MsoNormal, li.MsoNormal, div.MsoNormal  
    {mso-style-unhide:no;  
    mso-style-qformat:yes;  
    mso-style-parent:"";  
    margin:0cm;  
    margin-bottom:.0001pt;  
    mso-pagination:widow-orphan;  
    font-size:14.0pt;  
    font-family:宋体;  
    mso-bidi-font-family:宋体;}  
p.MsoHeader, li.MsoHeader, div.MsoHeader  
    {mso-style-noshow:yes;  
    mso-style-priority:99;  
    mso-style-link:"页眉 Char";  
    margin:0cm;  
    margin-bottom:.0001pt;  
    text-align:center;  
    mso-pagination:widow-orphan;  
    layout-grid-mode:char;  
    font-size:9.0pt;  
    font-family:宋体;  
    mso-bidi-font-family:宋体;}  
p.MsoFooter, li.MsoFooter, div.MsoFooter  
    {mso-style-noshow:yes;  
    mso-style-priority:99;  
    mso-style-link:"页脚 Char";  
    margin:0cm;  
    margin-bottom:.0001pt;  
    mso-pagination:widow-orphan;  
    layout-grid-mode:char;  
    font-size:9.0pt;  
    font-family:宋体;  
    mso-bidi-font-family:宋体;}  
p.MsoAcetate, li.MsoAcetate, div.MsoAcetate  
    {mso-style-noshow:yes;  
    mso-style-priority:99;  
    mso-style-link:"批注框文本 Char";  
    margin:0cm;  
    margin-bottom:.0001pt;  
    mso-pagination:widow-orphan;  
    font-size:9.0pt;  
    font-family:宋体;  
    mso-bidi-font-family:宋体;}  
span.Char  
    {mso-style-name:"页眉 Char";  
    mso-style-noshow:yes;  
    mso-style-priority:99;  
    mso-style-unhide:no;  
    mso-style-locked:yes;  
    mso-style-link:页眉;  
    font-family:宋体;  
    mso-ascii-font-family:宋体;  
    mso-fareast-font-family:宋体;  
    mso-hansi-font-family:宋体;}  
span.Char0  
    {mso-style-name:"页脚 Char";  
    mso-style-noshow:yes;  
    mso-style-priority:99;  
    mso-style-unhide:no;  
    mso-style-locked:yes;  
    mso-style-link:页脚;  
    font-family:宋体;  
    mso-ascii-font-family:宋体;  
    mso-fareast-font-family:宋体;  
    mso-hansi-font-family:宋体;}  
span.Char1  
    {mso-style-name:"批注框文本 Char";  
    mso-style-noshow:yes;  
    mso-style-priority:99;  
    mso-style-unhide:no;  
    mso-style-locked:yes;  
    mso-style-link:批注框文本;  
    font-family:宋体;  
    mso-ascii-font-family:宋体;  
    mso-fareast-font-family:宋体;  
    mso-hansi-font-family:宋体;}  
p.msochpdefault, li.msochpdefault, div.msochpdefault  
    {mso-style-name:msochpdefault;  
    mso-style-unhide:no;  
    mso-margin-top-alt:auto;  
    margin-right:0cm;  
    mso-margin-bottom-alt:auto;  
    margin-left:0cm;  
    mso-pagination:widow-orphan;  
    font-size:14.0pt;  
    font-family:宋体;  
    mso-bidi-font-family:宋体;}  
span.msonormal0  
    {mso-style-name:msonormal;  
    mso-style-unhide:no;}  
.MsoChpDefault  
    {mso-style-type:export-only;  
    mso-default-props:yes;  
    font-size:10.0pt;  
    mso-ansi-font-size:10.0pt;  
    mso-bidi-font-size:10.0pt;  
    mso-ascii-font-family:"Times New Roman";  
    mso-hansi-font-family:"Times New Roman";  
    mso-font-kerning:0pt;}  
 /* Page Definitions */  
@page WordSection1  
    {size:595.3pt 841.9pt;  
    margin:72.0pt 90.0pt 72.0pt 90.0pt;  
    mso-header-margin:42.55pt;  
    mso-footer-margin:49.6pt;  
    mso-paper-source:0;}  
div.WordSection1  
    {page:WordSection1;} 
    </style> 
  </head>`
  pageDoc += content  + "</body></html>"
  console.log(pageDoc)

  var base64data="base64,"+window.btoa(unescape(encodeURIComponent(pageDoc)));
  window.open('data:application/msword;'+ base64data);
}

export default wordExport
