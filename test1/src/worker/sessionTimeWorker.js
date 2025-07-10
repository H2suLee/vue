// sessionTimerWorker.js

var startTime = null; // 타이머 시작 시간
var timeoutSeconds = 0; // 타임아웃 시간 (초 단위)

// 타이머를 시작하는 함수
function startTimer() {
  // 1초마다 실행되는 타이머
  setInterval(function () {
    if (!startTime) return; // 시작 시간이 설정되지 않았다면 함수 종료

    var currentTime = new Date(); // 현재 시간
    var elapsedTime = Math.floor((currentTime - startTime) / 1000); // 경과 시간 (초)
    var remainingTime = timeoutSeconds - elapsedTime; // 남은 시간

    // 남은 시간이 0보다 작아지면 타임아웃
    if (remainingTime < 0) {
      self.postMessage({ type: "timeout" }); // 메인 스레드에 타임아웃 메시지 전송
      self.close(); // 워커 종료
    } else {
      // 남은 시간을 메인 스레드에 전송
      self.postMessage({
        type: "tick",
        remainingTime: remainingTime,
      });
    }
  }, 1000);
}

// 타이머를 리셋하는 함수
function resetTimer(newTimeoutSeconds) {
  startTime = new Date(); // 시작 시간을 현재로 설정
  timeoutSeconds = newTimeoutSeconds; // 새로운 타임아웃 시간 설정
}

// 워커에 메시지 이벤트 리스너 추가
self.addEventListener("message", function (e) {
  var data = e.data;
  // 'start' 또는 'reset' 명령을 받으면 타이머 리셋 및 시작
  if (data.command == "start" || data.command == "reset") {
    resetTimer(data.timeoutSeconds);
    startTimer();
  }
});
