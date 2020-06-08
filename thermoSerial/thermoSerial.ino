int val;
int tempPin = 1;

void setup() {
  
  Serial.begin(9600);
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
}

void loop() {
  // reset
  digitalWrite(8, LOW);    
  digitalWrite(9, LOW);    
  digitalWrite(10, LOW);  
  
  val = analogRead(tempPin);
  float mv = ( val/1024.0)*5000; 
  float cel = mv/10;
  float farh = (cel*9)/5 + 32;

  if(cel > 29 ) {
    // hot red
    digitalWrite(8, HIGH);    
  }else if( cel > 28 && cel < 29) {
    // normal green
    digitalWrite(9, HIGH);
  }else {
    // low blue
    digitalWrite(10, HIGH);
  }

  //Serial.print("OFFICE ROOM TEMPRATURE = ");
  Serial.print(cel);
  //Serial.print("*C");
  Serial.println();
  delay(1000);

  /* uncomment this to get temperature in farenhite 
  Serial.print("TEMPRATURE = ");
  Serial.print(farh);
  Serial.print("*F");
  Serial.println();
  */
}
