function getPwmValue(pwm, isHigh) {
  if (pwm > 1000) pwm = 1000;
  if (pwm < 0) pwm = 0;

  let timerValue = pwm * 10;
  if (isHigh) {
    // Заполнение
    return 10000 - timerValue > 9950 ? 9950 : timerValue; 
  } else {
    // Отключение
    timerValue = 10000 - timerValue;
    return timerValue < 50 ? 50 : timerValue; 
  }
}

let p = 1000
console.log(getPwmValue(p, 1));
console.log(getPwmValue(p, 0));