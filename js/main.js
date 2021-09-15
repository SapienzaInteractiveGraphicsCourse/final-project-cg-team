var light1, light2;
var models = {};
var laterals = [];
var trees = [];
var cups = [];
var cones = [];
var numlaterals = 6;
var numTrees = 10;
var numcups = 0;
var totalcups;
var numcones = 0;
var totalcones;
var maxTime;
var lifes = 3;
var score = 0;
var game_over = false;
var speedZ;

var character;  
var exit;
var speed;
var animation = 0;
var tremore = 0;


//street texture material and mesh
var roadTexture = textLoader.load('../textures/street.jpg');
var roadMaterial = new THREE.MeshLambertMaterial({map:roadTexture,});
var meshRoad = new THREE.Mesh(new THREE.PlaneBufferGeometry(600, 100000), roadMaterial);

//ground texture material and mesh
var groundTexture = textLoader.load('../textures/ground.jpg');  //texture loaded
var groundMaterial = new THREE.MeshLambertMaterial({map:groundTexture,});
var meshground = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);



function initAll()
{

	//renderer ( to initialize the scene)
	renderer.setSize(width, height);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
	container = document.getElementById('gamecontainer');
	container.appendChild(renderer.domElement);

	//camera
	camera.position.set(0,0,100);
	camera.lookAt(new THREE.Vector3(0,0,0));
	scene.add(camera);

	//lights
	light1 = new THREE.AmbientLight(0xe1e1d1, 1.4 , 1); //yellow
	light1.position.set(30, 10, 30);
	scene.add(light1);

	//clock (to load cones and cups)
	clock = new THREE.Clock();
	clock.start();  //for keeping track of time
}
 
// SKY
function Sky(){
	var skyTexture = textLoader.load("../textures/sky.jpg");
	var skyMaterial = new THREE.MeshBasicMaterial({map:skyTexture});
	var skyMesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 300, 32),skyMaterial);

	//planegeometry used to create plane geometries. parameters are: width,height,width sections and height sections (last two optional)
	///mesh is a Class representing triangular polygon mesh based objects

	skyMesh.position.set( 0 , 139, -250);
	scene.fog = new THREE.Fog(0xffffff, 500, 10000); 	//white
	scene.add(skyMesh)
}

// GROUND
function Ground(){
	//ground

	
	groundTexture.wrapS = THREE.RepeatWrapping; //This defines how the texture is wrapped horizontally and corresponds to U in UV mapping.
	groundTexture.wrapT = THREE.RepeatWrapping; //This defines how the texture is wrapped vertically and corresponds to V in UV mapping. The same choices are available as for .wrapS : number.
	groundTexture.repeat.set(25, 25); 
	groundTexture.encoding = THREE.sRGBEncoding; 


	meshground.position.y = -200;
	meshground.rotation.x = -Math.PI/2;
	scene.add(meshground);

	//street
	roadTexture.wrapS = THREE.RepeatWrapping;
	roadTexture.wrapT = THREE.RepeatWrapping;
	roadTexture.repeat.set(1, 25);
	roadTexture.encoding = THREE.sRGBEncoding;
	
	
	meshRoad.position.y = -199;
	meshRoad.rotation.x = -Math.PI/2;
	scene.add(meshRoad);
	
}



// LOADER MODELS
function loadModels(){
	loadGLTF('pump', "../models/pump.gltf", lateralsLoaded);
	loadGLTF('tree', "../models/tree.gltf", treeLoaded);
	loadGLTF('rustycar', "../models/rustycar.gltf", lateralsLoaded);
	loadGLTF('recyclebin', "../models/recyclebin.gltf", lateralsLoaded);
	loadGLTF(character, "../models/"+character+".gltf", saettaLoaded);
	loadGLTF('cup', "../models/cup.gltf", function(){});
	loadGLTF('cone', "../models/cone.gltf", function(){});
}


function loadGLTF(name, path, modelLoaded){
	loader.load(path, function(gltf){    
		models[name] = gltf.scene;
		modelLoaded();
	},
	function(xhr){console.log(name + ' ' + (xhr.loaded / xhr.total * 100) + '% loaded');},
	function(error){console.log('An error happened'+error);}
	);
}


//laterals cloned
function lateralsLoaded(){
	if(models['pump'] && models['rustycar'] && models['recyclebin']){  //if all three lateral models loaded (above function)
		for(i=0; i<2; i++){
			laterals.push(models['pump'].clone());  //clone the laterals doing 3 copies in total
			laterals.push(models['rustycar'].clone());
			laterals.push(models['recyclebin'].clone());
		}

		//rusty pump
		laterals[0].position.set(65, -30, -170);   //specify laterals position
		laterals[0].rotation.y=160;
		laterals[0].scale.set(0.05,0.05,0.05);

		//rusty car
		laterals[1].position.set(75, -30, -100);
		laterals[1].scale.set(0.15,0.15,0.15);  //scale the laterals

		//recycle bin
		laterals[2].position.set(75, -30, 0);
		laterals[2].scale.set(0.65,0.65,0.65);  //scale the laterals
		


		//rusty pump
		laterals[3].position.set(-65, -30, -140);
		laterals[3].rotation.y=100;
		laterals[3].scale.set(0.05,0.05,0.05);

		//rusty car
		laterals[4].position.set(-75, -30, -70);
		laterals[4].scale.set(0.15,0.15,0.15);  //scale the laterals
		
		//recyclebin
		laterals[5].position.set(-75, -30, 30);
		laterals[5].scale.set(0.65,0.65,0.65);  //scale the laterals


		for(i=0; i<numlaterals; i++){
			scene.add(laterals[i]);
		}
	}
}

//trees cloned
function treeLoaded(){   //analog to lateralloaded
	for(i=0; i<numTrees; i++){
		trees.push(models['tree'].clone());
		
	}

	trees[0].position.set(50, -22, -190);
	trees[1].position.set(50, -22, -120);
	trees[2].position.set(50, -22, -50);

	trees[6].position.set(50, -22, 0);
	trees[7].position.set(50, -22, 50);


	trees[3].position.set(-50, -22, -160);
	trees[4].position.set(-50, -22, -90);
	trees[5].position.set(-50, -22, -20);

	trees[8].position.set(-50, -22, 30);
	trees[9].position.set(-50, -22, 90);

	for(i=0; i<numTrees; i++){ 
		trees[i].scale.set(0.35,0.35,0.35);
		scene.add(trees[i]);
	}
}

//saetta
function saettaLoaded(){
	models[character].position.set(0, -40, 20);
	models[character].scale.set(0.07,0.07,0.07);
	models[character].rotation.y = Math.PI;
	scene.add(models[character]);
}







document.addEventListener("keydown", onDocumentKeyDown, false); //when  pressing on keyboard
function onDocumentKeyDown(event){
	var comand = event.which;  //return a number corresponding to the button pressed on the keyboard
	if(comand == 37){	//left
		if(models[character].position.x != -37){
			models[character].position.x -= 37;  //move to left if pressed th left arrow
			
		}
	}else if(comand == 39){ //right
		if(models[character].position.x != 37){
			models[character].position.x += 37;
			
 		}
	}
}


function renderstreetandground(){

	if(!game_over){ //if not lifes == 0 then the animation just keep going
        
		meshRoad.position.z += speedZ + 2;
		meshground.position.z += speedZ + 2;
		
		if(meshRoad.position.z > 3500)   //ground and street will slide and then i'll put them back before they end
		{
			meshRoad.position.z = 0;
		}

		if(meshground.position.z > 3500)
		{
			meshground.position.z = 0;
		}
		
	}

}


function rendersaetta(){
	
	if(game_over) //if not lifes == 0 then the animation just keep going
    {	//if game over, saetta moved to the center and rotate

		if(animation < 400)
		{
			animation += 2;
		}
		models[character].position.x = 0;
		models[character].position.y = -30; 
		models[character].rotation.y -= 0.01;

		if(character == 'saetta')
		{
		models[character].traverse(function(child){
			if(child.name == "Object_5" && animation < 399)
			{
                child.position.z -= 1;
			}
			else if((child.name == "Object_6" || child.name == "Object_7"|| child.name == "Object_2" ) && animation < 399)
			{
				child.position.z += 1;
			} 
			
		    });
	   }else if (character == 'hicks')
	   {

		models[character].traverse(function(child){
			if(child.name == "Object_4" && animation < 399)  //4 = ruote
			{
                child.position.z -= 1;
			}
			else if((child.name == "Object_2" || child.name == "Object_3") && animation < 399)
			{
				child.position.z += 1;
			} 
          });

	   }
	   else{
		models[character].traverse(function(child){
			if(child.name == "Object_4" && animation < 399)  //4 = ruote
			{
                child.position.z -= 1;
			}
			else if((child.name == "Object_2" || child.name == "Object_3") && animation < 399)
			{
				child.position.z += 1;
			} 
			
          });

	   }
		
	}
	else{
		tremore += 1;
        models[character].traverse(function(child){
          if(child.name != "Object_5" && character == 'saetta')   //trema tutto tranne le ruote
		  {
			  if(tremore%2 == 0) child.rotation.y += 0.02;
			  else child.rotation.y -= 0.02;
		  }
		  if(child.name != "Object_4" && character != 'saetta')
		    {
				if(tremore%2 == 0) child.rotation.y += 0.02;
			  else child.rotation.y -= 0.02;
			}
		});


		speedZ += 0.001;  //speed will increase in any case at any difficulty
	} 
}

//get the variable from index.html url
function Level() {
	var queryString = window.location.search; //take the part of the url after ?
	var urlParams = new URLSearchParams(queryString);

	speed = urlParams.get('speed'); //recover the speed
	console.log(speed);
	speedZ = 1.5;
	if(speed == 'easy'){
		totalcups = 4;
		totalcones = 4;
		maxTime = 3;
	}else if(speed == 'medium'){
		totalcups = 4;
		totalcones = 6;
		maxTime = 2;
	}else if(speed == 'hard'){ //depending on the speed selected change the parameters of the animation
		totalcups = 4;
		totalcones = 8;
		maxTime = 1;
	}
	
	
}

function setcharacter(){
	var queryString = window.location.search; //take the part of the url after ?
	var urlParams = new URLSearchParams(queryString);
	character = urlParams.get('character');
}

//render laterals
function renderlaterals(){ //update laterals position
	for(i=0; i<numlaterals; i++){
		if(laterals[i].position.z > 70){
			laterals[i].position.z = -250;
		}
		laterals[i].position.z += speedZ;
	
	}
	
}

//render trees
function renderTrees(){ //update trees position
	for(i=0; i<numTrees; i++){
		if(trees[i].position.z > 80){    //i put them back when they are offscreen
			trees[i].position.z = -350;  //i put them back in a certain dinstance in order to have a fluid game
		}
		trees[i].position.z += speedZ; //in order to have a smoother transition
	}
}

//random x position for cups and cones
function randomPosX(){
	var randPos = Math.floor(Math.random() * 3);	//random number {0,1,2}: 0=left, 1=center, 2=right
	var posX = 0;
	if(randPos == 0){
		posX = -45;
	}else if(randPos == 1){
		posX = 0;
	}else{
		posX = 45;
	}
	return posX;
}

//load either an cone or a cup randomly and position it randomly
function loadElements(){
	var rand = Math.floor(Math.random() * 2);	//random number {0,1}: 0=cone, 1=cup 
	var posX = randomPosX(); //randomly deciding in which lane spawn it
	if(rand == 0 && numcones < totalcones){	
		cones.push(models['cone'].clone()); //crea ostacolo
		cones[numcones].position.set(posX,-43,-650); //position of cone/cup
		cones[numcones].scale.set(6,6,6);//size of cone
		cones[numcones].rotation.y = 210; 
		scene.add(cones[numcones]); //pusho l'ultimo ostacolo creato
		numcones+=1; //aumento il numero di ostacoli
	}else if(rand == 1 && numcups < totalcups){ //analog to cone
		cups.push(models['cup'].clone());
		cups[numcups].position.set(posX, -43, -650);
		cups[numcups].scale.set(0.25,0.25,0.25);
		scene.add(cups[numcups]);
		numcups+=1;
	}
}

/*
	move back cup when it reach end of the scene or hit saetta
	check if cup and cone overlap
*/

function updatecup(i){
	var posX = randomPosX();
	cups[i].position.x = posX; //respawn randomly in one of the three lane
	for(j=0; j<numcups; j++){
		var distance = Math.abs(-650 - cups[j].position.z)
		if(distance < 10 && i != j)
			cups[i].position.z = -665;
		else
			cups[i].position.z = -650;
	}
	for(j=0; j<numcones; j++){
		var distance = Math.abs(-650 - cones[j].position.z)
		if(distance < 10)
			cups[i].position.z = -665;
		else
			cups[i].position.z = -650;
	}
}

//render cups
function rendercups(){
	for(i=0; i<numcups; i++){ //per tutti i cup creati
		if(cups[i].position.z > 20){ //quando esce dalla scena (>20)
			updatecup(i); //lo riporto indietro
		}
		cups[i].position.z += speedZ; //in ogni caso il cup deve continuare ad avanzare
		cups[i].rotation.y += 0.05;  //e mentre avanza ruota su se stesso
	}
}

/*
	move back cone when it reach end of the scene or hit saetta
	check if cone and cup overlap
*/

function updatecone(i){ //analog to cup
	var posX = randomPosX();
	cones[i].position.x = posX;
	for(j=0; j<numcones; j++){
		var distance = Math.abs(-650 - cones[j].position.z)
		if(distance < 10 && i != j)
			cones[i].position.z = -665;
		else
			cones[i].position.z = -650;
	}
	for(j=0; j<numcups; j++){
		var distance = Math.abs(-650 - cups[j].position.z)
		if(distance < 10)
			cones[i].position.z = -665;
		else
			cones[i].position.z = -650;
	}
}

//render cones
function rendercones(){
	for(i=0; i<numcones; i++){
		if(cones[i].position.z > 20){ //when it reach the end of the scene
			updatecone(i);
		}
		cones[i].position.z += speedZ;
		//cones[i].rotation.y += 0.05;
	}
}

//to check if element and saetta are on the same x side (for collision)
function lane(pos){
	if(pos > 0 && models[character].position.x > 0) return true;
	else if(pos < 0 && models[character].position.x < 0) return true;
	else if(pos == 0 && models[character].position.x == 0) return true;
	else return false;
}

/*
	check if a collision between saetta and cone or cup happens
	in this function is checked if game over happens
*/
function checkCollision(){
	if(lifes > 0){
		for(i=0; i<numcones; i++){
			var distance = Math.abs(cones[i].position.z - models[character].position.z); //check the distance between character and the current cones
			if(distance <= 50 && lane(cones[i].position.x)){ //if they are close enough and on the same side
				
				updatecone(i); //move the ostacle
				lifes -= 1; //decrease lifes
				var name = "heart"+lifes;
				document.getElementById(name).src = "../images/heart2.png";
				if(lifes == 0){
					game_over = true;
					gameOver();
				}
			}
		}

		//same thing of above but with cups instead of cones and there is not game over if hit cups
		for(i=0; i<numcups; i++){
			var distance = Math.abs(cups[i].position.z - models[character].position.z);
			if(distance <= 30 && lane(cups[i].position.x)){
				console.log('cup');
				updatecup(i);
				score += 1;
				var elem = document.getElementById('score2');
				elem.innerHTML = score;
			}
		}
	}
}



//game over function
function gameOver(){
	var over = document.createElement('img');
	over.style.position = 'relative';
	over.className = 'center';
	over.height = 300;
	over.style.top = 20 + '%';
	over.src = "../images/game_over.png";  //visualize on the screen the game over image when you lose

	
	exit.style.position = "relative";
	exit.style.top = 35 + '%';
	exit.style.left = 0 + '%';

	
	var again = document.createElement('button');
	again.style.position = "relative";
	again.style.top = 40 + '%';
	again.style.left = 0 + '%';
	again.className = "btn btn-dark btn-lg center";
	again.innerHTML = "Play Again"; 
	again.addEventListener('click', function(){window.location.href = "./main.html?speed="+speed+"&character="+character;});


	document.getElementById('gameover').appendChild(over);
	document.getElementById('gameover').appendChild(again);
	
}

//visualization of hearts on the page and LIFES writing
function Hearts(){
	var life = document.createElement('img');
	life.style.position = 'absolute';
	life.height = 50;
	life.width = 100;
	life.style.top = 5 + '%';
	life.style.left = 0 + '%';
	life.src = "../images/lifes.png";

	var heart0 = document.createElement('img');
	heart0.id = 'heart0';
	heart0.style.position = 'absolute';
	heart0.height = 50;
	heart0.width = 50;
	heart0.style.top = 50 + 'px';
	heart0.style.left = 10 + 'px';
	heart0.src = "../images/heart.png"

	var heart1 = document.createElement('img');
	heart1.id = 'heart1';
	heart1.style.position = 'absolute';
	heart1.height = 50;
	heart1.width = 50;
	heart1.style.top = 50 + 'px';
	heart1.style.left = 60 + 'px';
	heart1.src = "../images/heart.png"

	var heart2 = document.createElement('img');
	heart2.id = 'heart2';
	heart2.style.position = 'absolute';
	heart2.height = 50;
	heart2.width = 50;
	heart2.style.top = 50 + 'px';
	heart2.style.left = 110 + 'px';
	heart2.src = "../images/heart.png"

	document.getElementById('hearts').appendChild(life);
	document.getElementById('hearts').appendChild(heart0);
	document.getElementById('hearts').appendChild(heart1);
	document.getElementById('hearts').appendChild(heart2);

	//create the image of the heart and the writing on top left of the screen
}

//visualization of score on the page
function Score(){ //same as above but for score writing and count on top right
	var score = document.createElement('img');
	score.style.position = 'absolute';
	score.height = 50;
	score.width = 100;
	score.style.top = 15 + '%';
	score.style.left = 0 + '%';
	score.src = "../images/score.png";

	var score2 = document.createElement('h2');
	score2.id = 'score2';
	score2.style.position = 'absolute';
	score2.style.top = 22 + '%';
	score2.style.left = 3 + '%';
	score2.textContent = '0';  //start with a 0 score and increase when you pick a cup

	document.getElementById('score').appendChild(score);
	document.getElementById('score').appendChild(score2);
}

function ExitButton()
{
	exit = document.createElement('button');
	exit.style.position = "absolute";
	exit.style.top = 10 + 'px';
	exit.style.right = 10 + 'px';
	exit.className = "btn btn-dark btn-lg center";
	exit.innerHTML = "Exit"; 
	exit.addEventListener('click', function(){window.location.href = "../index.html";});

	document.body.appendChild(exit); //to visualize exit button during game
}

function allReady() //check if all the models are loaded
{  
	if(models[character] && models['pump'] && models['rustycar'] && models['recyclebin'] && models['tree'] && models['cup'] && models['cone'])
		return true;
	else
		return false;
}

// RENDER THE SCENE
function render(){
	renderer.render(scene, camera);


	if(allReady()){

		
		rendersaetta();
		renderstreetandground();
		renderlaterals();
		renderTrees();
		rendercups();
		rendercones();
		checkCollision();
		if(clock.getElapsedTime() > maxTime){  //getElapsedTime return the time passed from the starting of the clock
			clock.start();
			loadElements();
		}
	}		
	requestAnimationFrame(render);
	/*
	The window.requestAnimationFrame() method tells the browser that you wish to perform an 
	animation and requests that the browser calls a specified function to update an animation
	 before the next repaint. The method takes a callback as an argument to be invoked before the repaint
	*/
}

function main(){

	initAll();
	/*
	initial settings:

	 -lights
	 -camera
	 -renderer (WebGLRenderer)
	 -clock
	 */
	
	ExitButton();
	//create the exit button 

	Hearts();
	Score();
    //sistema le immagini del punteggio e delle vite

	Sky();
	//crea il cielo senza modelli, usando una texture, il materiale e il mesh con three.js per poi aggiungere il tutto alla scena

	Ground();
	//crea la strada e il prato ai lati

	setcharacter();
	//recover the selected character in the index page

	loadModels();
    //carica i modelli nella cartella models. e specifica la funzione per gestirli
	
	Level();
	//recover the selected difficulty in the index page

	render();
    //chiama le funzioni di render di ogni modello, ognuna di esse si occupa dell'animazione di un singolo modello.
	
}

main();