//--定数管理--
  // - 今日の日付(currentDate)と曜日(dayOfWeek)
  let currentDate = new Date();
  currentDate.setHours(0,0,0,0);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const dayOfWeek = days[currentDate.getDay()];
  
  // 給餌機の餌の量
  const amountOfFeeder = 1000;

  // スプレッドシート取得
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シートの名前');


/**
 * メイン関数
 * シートのA列から今日の日付を探す: checkFeedingDate()
 *    ある場合（特に何もしない)
 *    ない場合（シートに今日の日付 + I欄（自動給餌の量）に任意の数を追記）: addFeedingInfo()
 */
function checkFeeding() {
  if (checkFeedingDate(currentDate)) {
    // Logger.log("特にやることないよ〜");
    return
  } else {
    const lastRow = sheet.getLastRow(); 
    addFeedingInfo(currentDate, dayOfWeek, amountOfFeeder, lastRow)
  }
}

/**
 * return: boolean
 * シートから今日の日付を探す。
 */
function checkFeedingDate(currentDate) {
  const data = sheet.getRange("A:A").getValues();
  for (var i = 0; i < data.length; i++) {
    const cellValue = data[i][0];
    if (cellValue instanceof Date) {
      if (cellValue.getTime() === currentDate.getTime()) {
        return true;
      }
    }
  }
}

/**
 * return: void
 * シートに今日の日付、曜日、自動給餌器の餌の量を記述
 */
function addFeedingInfo(date, dayOfWeek, amountFeed, lastRow){
  const addData = [date, dayOfWeek,"","","","","","",amountFeed]
  sheet.getRange(lastRow + 1, 1, 1, addData.length).setValues([addData]);
}
