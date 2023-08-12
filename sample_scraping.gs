const ss = SpreadsheetApp.getActiveSpreadsheet();
const currentYearAndMonth = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy_MM");
let sheet = ss.getSheetByName(currentYearAndMonth);
const url = "自分の好きなURL"
const lightGray = "#f3f3f3"

function main (){
  //今月のシートが作られているかのチェック
  checkCreateSheat()
  // 記事取得
  const articleList = listDailyFigureInfo(url)
  articleList.forEach(setInfoList);
}

/**
 * リストに追加されたタイトルを配列で取得
 * return array:タイトル
 */
function getListedTitles() {
  let list = [];
  const data = sheet.getDataRange().getValues().slice(1); 
  data.forEach(function(val){
    list.push(val[0])
  })
  return list
}

/**
 * 今月のシートが作られているかのチェック
 * return void: シートがなければ新規で作成
 */
function checkCreateSheat() {
  if (sheet === null){
    addAndApplyRules();
  }
}

/**
 * 新規に作られたシートへのフォーマット適用
 */
function addAndApplyRules() {
  ss.insertSheet(currentYearAndMonth);
  sheet = ss.getSheetByName(currentYearAndMonth);
  sheet.appendRow(["タイトル","詳細URL","商品画像","欲しい"])
  //列のサイズ調整
  sheet.setColumnWidth(1,300);
  sheet.setColumnWidth(2,200);
  sheet.setColumnWidth(3,450);
  sheet.setColumnWidth(4,100);
  //行のサイズ調整
  sheet.setRowHeight(1, 50)
  //タイトル行の調整
  var firstRowRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  firstRowRange.setFontSize(15);
  firstRowRange.setHorizontalAlignment("center");
  firstRowRange.setVerticalAlignment("middle");
  firstRowRange.setBackground(lightGray);
  //表部分の調整
  var range = sheet.getRange(2, 1, 1000, sheet.getLastColumn());
  range.setFontSize(20);
  range.setWrap(true);
  range.setHorizontalAlignment("center");
  range.setVerticalAlignment("middle");
  //行の固定
  sheet.setFrozenRows(1);
}

/**
 * fig速の記事情報をurlからリスト形式で取得
 * return object:記事情報
 */
function listDailyFigureInfo(url) {
  const response = UrlFetchApp.fetch(url);
  const maincontent = response.getContentText("utf-8");
  return Parser.data(maincontent).from('<article>').to('</article>').iterate().reverse();
}

/**
 * 記事情報から抽出した一覧をスプレッドシートに記述
 * return void: 情報一覧 + チェックボックスをスプレッドシートに追加
 * 行の高さを200に変更
 */
function setInfoList(val){
  const listedTitles = getListedTitles()
  const infoArray = getInfo(val);
  const title = infoArray[0]
  if (listedTitles.indexOf(title) == -1){
    sheet.appendRow(infoArray);
    const lastRow = sheet.getLastRow()
    addCheckbox(lastRow)
    sheet.setRowHeight(lastRow, 200)
  }
}

/**
 * 情報の抽出
 * return array:タイトル、詳細リンク、画像データ
 */
function getInfo(val){
  const entryTitle = Parser.data(val).from('<h1 class="entry_title">').to('</h1>').iterate();
  const text = Parser.data(val).from('<div class="entry_text">').to('</div>').iterate();
  const urlList = Parser.data(text[0]).from('href="').to('"').iterate();
  const moreDetail = urlList[urlList.length - 1]
  const img = "=image(" +`"${urlList[0]}"`+")"
  const title = getTitleValue(entryTitle);
  return [title, moreDetail, img];
}

/**
 * チェックボックスの追加
 */
function addCheckbox(lastRow){
  const range = sheet.getRange(`D${lastRow}`);
  range.insertCheckboxes();
}

/**
 * タイトルの取得
 * return string: タイトル名
 */
function getTitleValue(entryTitle) {
  const nameAttributePattern = /name="(.*?)"/;
  const match = entryTitle[0].match(nameAttributePattern);
  if (match) {
    return match[1];
  } else {
    return "name属性が見つかりませんでした。";
  }
}