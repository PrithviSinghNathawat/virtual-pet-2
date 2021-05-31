var dog,happyDog;
var foodObj;
var foodS,foodStock;
var fedTime, lastFed, feed, addFood;

function preload()
{
  dogimg=loadImage('images/Dog.png');
  happyDogimg=loadImage('images/happydog.png');
	
}

function setup() {
	database = firebase.database();
  createCanvas(1000, 400);

  foodObj= new Food1();

  foodStock=database.ref('Food');
  foodStock.on('value',readStock);

  dog = createSprite(800,200,150,150);
  dog.addImage(dogimg);
  dog.scale=0.15;

  feed = createButton('Feed The Dog');
  feed.positon(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton('Add Food');
  addFood.positon(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(155,255,155);

  foodObj.display();

  fedTime= database.ref('FeedTime');
  fedTime.on("value",function (data){
    lastFed = data.val();
  })

  fill(180,180,180);
  textSize(15);
  if(lastFed>= 12){
    text('Last Feed:',lastFed%12 + "PM",350,30);
  }
  else if(lastFed==0){
    text('Last Feed:12AM',350,30);
  }
  else {
    text('lastFeed:'+lastFed+"AM",350,30);
  }

  drawSprites();

}



function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }


  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

