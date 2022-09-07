/*

The Game Project 7 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var gameOver;
var flagpole;


var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var clouds;
var mountains;
var collectable;
var canyon;

var platform_List;
var platforms;
var lives;
var enemies;
var score;


//sound variables
var jumpSound;
var coinCollect;
var deathSound;
var finishgame;
var GameWon;

var gameOverCount; //variable to delay gameStart function when character dies

function preload()
{
    
    jumpSound = loadSound("assets/jump1.wav"); //jump sound
    coinCollect = loadSound("assets/coincollect.wav"); //sound for collectable
    deathSound = loadSound("assets/death.wav"); //sound for when character dies
}

function setup()
{
	createCanvas(window.innerWidth, window.innerHeight);
	floorPos_y = height * 3/4;
    lives = 4; //initial lives
    start_Game(); //game starts
}

function start_Game()
{
    gameChar_x = width/4;
	gameChar_y = floorPos_y;
    var incr = (width + 1000)/5;
    

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    gameOver = false;
    gameOverCount = 65;

	// Initialise arrays of scenery objects.
    trees_x = []; //tree array
    
    for(var i = 0; i < 15; i ++)//fill treeArray
    {
         var tree_dist = -2000 + incr * i;
            trees_x.push(tree_dist);
    }
    
    clouds = []; //clouds array
    //draw lots of clouds
    for (var i = 0; i < 15; i++)
    {
        var cloud_obj =  {pos_X: -2000 + incr * i, pos_Y: random(50,200), width: random(50,70),height: random(50,70)};
            
        clouds.push(cloud_obj);
    }
    
    mountains = []; //mountain array 
    //to draw many mountains
    for(var i = 0; i < 13; i++)
    {
        var mount_Obj = {pos_X: -1000 + incr * i, pos_Y: floorPos_y,height: random(150,350),width: 190};
        
        mountains.push(mount_Obj);
    };
         
    //collectables array of objects
    collectable = 
        [ 
            {pos_X: -800, pos_Y: floorPos_y - 80, size: 40, isFound: false},
            {pos_X: -500, pos_Y: floorPos_y -100, size: 40, isFound: false},
            {pos_X: 100, pos_Y: floorPos_y - 22, size: 40, isFound: false},
            {pos_X: 860, pos_Y: floorPos_y - 22, size: 40, isFound: false},
            {pos_X: 1115, pos_Y: floorPos_y - 70, size: 40, isFound: false},
            {pos_X: 1650, pos_Y: floorPos_y - 70, size: 40, isFound: false},
            {pos_X: 1815, pos_Y: floorPos_y - 120, size: 40, isFound: false},
            {pos_X: 1990, pos_Y: floorPos_y - 70, size: 40, isFound: false},
            {pos_X: 2350, pos_Y: floorPos_y - 80, size: 40, isFound: false}
        ]; 
    
    //canyon array of objects
    canyon = 
        [ 
            {pos_X: -1000, pos_Y: floorPos_y, width: 105},
            {pos_X: -900, pos_Y: floorPos_y, width: 105},
            {pos_X: 580, pos_Y: floorPos_y, width: 105 },
            {pos_X: 625, pos_Y: floorPos_y, width: 105},
            {pos_X: 1000, pos_Y: floorPos_y, width: 105},
            {pos_X: 1105, pos_Y: floorPos_y, width: 105},
            {pos_X: 1565, pos_Y: floorPos_y, width: 105},
            {pos_X: 1670, pos_Y: floorPos_y, width: 105},
            {pos_X: 1775, pos_Y: floorPos_y, width: 105},
            {pos_X: 1880, pos_Y: floorPos_y, width: 105},
            {pos_X: 1985, pos_Y: floorPos_y, width: 105},
            {pos_X: 2700, pos_Y: floorPos_y, width: 105},
            {pos_X: 2750, pos_Y: floorPos_y, width: 105},
            {pos_X: 2905, pos_Y: floorPos_y, width: 105},
            {pos_X: 2955, pos_Y: floorPos_y, width: 105},
        ]; 
    
    //flagpole object
    flagpole = {x_pos:3500  , Reached : false};
    
    //list of platforms
    platform_List = [
        {pos_X: -500, pos_y: floorPos_y - 50, width: 100},
        {pos_X: 1060, pos_y: floorPos_y - 50, width: 100},
        {pos_X: 1600, pos_y: floorPos_y - 50, width: 100},
        {pos_X: 1750, pos_y: floorPos_y - 100, width: 100},
        {pos_X: 1910, pos_y: floorPos_y - 50, width: 120},
        {pos_X: 2250, pos_y: floorPos_y - 60, width: 170}
    ];

    platforms = []; //empty platform array
    for(var i = 0; i < platform_List.length; i++)
        {
            platforms.push(createPlatform(platform_List[i].pos_X,platform_List[i].pos_y,platform_List[i].width)); //pushing createPlatform function into platforms array
        };  
    
    lives--; //reduce lives by 1 each time StartGame function is called
    
    score = 0; //score set to 0 each time game starts
    
    enemies = []; //enemies array
    
    //adding arguments to the enemy function and pushing into enemies Array
    enemies.push(new Enemy(-750, floorPos_y, 400, "x"));
    enemies.push(new Enemy(-530, floorPos_y, 200, "x"));
    enemies.push(new Enemy(750, floorPos_y, random(150,200), "x"));
    enemies.push(new Enemy(1220, floorPos_y, 340, "x"));
    enemies.push(new Enemy(3150, floorPos_y, 250, "x"));
    enemies.push(new Enemy(1800, floorPos_y - 250, 300, "y"));
    enemies.push(new Enemy(1650, floorPos_y - 200, random(300,400), "y"));
    enemies.push(new Enemy(2000, floorPos_y - 100, 200, "y"));
    enemies.push(new Enemy(3000, floorPos_y - 50, random(100,200), "y"));
    
    //adding boss enemy to the enemies array
    enemies.push(new Enemy(2500, floorPos_y,0,"x","Boss"))
};

function draw()
{
	background(100, 155, 255); // fill the sky blue
    console.log(gameChar_y)

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos,0);
    
	// Draw clouds.
    drawCloud();

	// Draw mountains.
    drawMountains();

	// Draw trees.
    drawTrees();
    
    //calling Draw and check flagpole functions
    DrawFlagpole();
    checkFlagpole();

	// calling Draw canyons and check canyons.
    for(var i = 0; i < canyon.length; i++)
    {
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
    };
    
	//calling Draw collectable items.
    for(var i = 0; i < collectable.length; i++)
    {
        if(collectable[i].isFound == false)
            {
                drawCollectable(collectable[i]);
                checkCollectable(collectable[i]);
            }       
    }
    
    //calling create platforms platforms
    for(var i = 0; i < platforms.length; i++)
    {
            platforms[i].create();
    }
    
    //calling enemies draw and update function
    for (var i = 0; i < enemies.length; i++) 
    {
            enemies[i].update();
            enemies[i].bossUpdate();
            enemies[i].draw();
         
        //check if enemies in contact then start game if they touch Game Character
         if(enemies[i].isContact(gameChar_world_x, gameChar_y)) 
         {
            gameOver = true;
         }
        
        if(gameOver == true)
         {
            enemies[i].incr = 0;
            isLeft = false;
            isRight = false;
            isFalling = false;
            isPlummeting = false;
        }
        
     }
    
    if(gameChar_world_x > 2250 && gameChar_world_x < 2420)
    {
        fill(255);
        textSize(20);
        text("Jump and Run for your life and don't look back",gameChar_world_x - 250, floorPos_y - 150);
    }

        
    pop();
    
    //draw lives
    for(var i = 0;i < lives; i++)
    {
        fill(0);
        noStroke();
        textSize(40);
        text("Lives:",10,35);
        fill(200,0,0);
        triangle(115 + 50 * i,25,130 + 50* i, 7,145 + 50 * i, 25);
        fill(100);
        ellipse(130 + 50 * i, 7, 10);
        fill(255,150,150);
        triangle(115 + 50 * i,25,130 + 50* i, 50,145 + 50 * i, 25); 
    }
    
    //set score
    for(var i = 0; i < collectable.length; i++)
    fill(0,0,0);
    noStroke();
    text("Score: " + score, 290, 35)

    //if character is out of lives, print this to screen
    if(lives < 1)
    {
        noStroke();
        fill(0);
        textSize(50);
        text("Oops, You ran out of lives. Game Over", 100, 200);
        text("Press Space to Continue", 200, 300);
        return;
    };
    
    
	// calling Draw game character function.
	drawGameChar();


    //game character falling down the canyon
    if(isPlummeting == true)
    {
        isLeft = false;
        isRight = false;
        gameChar_y += 8;
    }	

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.8)
		{
			gameChar_x -= 3;
		}
		else
		{
			scrollPos += 3;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.5)
		{
			gameChar_x  += 3;
		}
		else
		{
			scrollPos -= 3; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall and calling checkPlatform function if character falls on platform
    if (gameChar_y < floorPos_y){
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
            {
                if(platforms[i].check(gameChar_world_x,gameChar_y))
                    {
                        isContact = true;
                        break;
                    }
            }
        if(isContact == false)
            {
                isFalling = true;
                gameChar_y += 2;
            }
        else{
            isFalling = false;
        }
    }
    else{
        isFalling = false;
    }
        
    // If flagpole is reached, print level complete to screen
    if (flagpole.Reached == true){
        fill(0);
        textSize(60);
        text('LEVEL COMPLETE!' , width/4, height/3);
        text('Press Space to Continue' , width/4, height/2);
        return;
    }
    
    //if character falls on spikes in canyon or in contact with enemy, restart game
        if(gameOver && lives > 0)
        {
            //wait on the screen for a few seconds before restarting game
            gameOverCount -= 1;
            
            if(gameOverCount == 0)
            {
                deathSound.play();
                start_Game();
            }
        }


	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}




// ---------------------
// Key control functions
// ---------------------
function keyPressed(){
            //"a" or "left arrow" pressed move left
         if (keyCode == 65 || keyCode == 37)
            {
                isLeft = true;
            }
        //if "d" or "right arrow" pressed move right
        else if (keyCode == 68 || keyCode == 39)
            {
                isRight = true;
            }
        //if "w" or "space" pressed jump
        if (keyCode == 87 || keyCode == 32)
            {
                jumpSound.play();
                //jump only when character on ground or platform
                for(var i = 0; i < platforms.length; i++)
                    {
                if(gameChar_y == floorPos_y || platforms[i].check(gameChar_world_x,gameChar_y) == true)
                {
                    isFalling = true;
                    gameChar_y -= 110;
                }
                    }
            }
}

function keyReleased()
{
    //if "a" released stop moving
    if (keyCode == 65 || keyCode == 37)
        {
            isLeft = false;
        }
    //if "d" released stop moving
    else if (keyCode == 68 || keyCode == 39)
        {
            isRight = false;
        }
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar()
{
	if(isLeft && isFalling)
	{
		fill(0);
        stroke(0);
        strokeWeight(1);
        //legs
        rect(gameChar_x - 6,gameChar_y - 8,5,5);
        rect(gameChar_x - 2,gameChar_y - 13,5,10);
    
        fill(200,0,0);
        rect(gameChar_x - 7,gameChar_y - 28,15,20); //torso
        
        fill(240);
        ellipse(gameChar_x,gameChar_y - 36,17,17); //face
    
        fill(240);
        triangle(gameChar_x - 3,gameChar_y - 27,
                 gameChar_x - 14,gameChar_y - 12,
                 gameChar_x - 8,gameChar_y - 33); //beard

        fill(100,100,100);
        ellipse(gameChar_x - 1,gameChar_y - 69,7,7); //pom pom on hat
    
        fill(200,0,0);
        triangle(gameChar_x - 8,gameChar_y - 43,
                 gameChar_x - 1,gameChar_y - 68,
                 gameChar_x + 7,gameChar_y - 43); //hat
    
        strokeWeight(2);
        point(gameChar_x - 7,gameChar_y - 39); //eye
    
        strokeWeight(1);
        line(gameChar_x - 6,gameChar_y - 35,
             gameChar_x - 8,gameChar_y - 35); //mouth
    
        quad(gameChar_x + 2,gameChar_y - 48,
             gameChar_x - 1,gameChar_y - 48,
             gameChar_x - 1,gameChar_y - 24,
             gameChar_x + 2,gameChar_y - 24); //arm
    
        fill(240);
        ellipse(gameChar_x,gameChar_y - 48,4,4); //hand
	}
	else if(isRight && isFalling)
	{
		fill(0);
        stroke(0);
        strokeWeight(1);
    
        rect(gameChar_x + 2,gameChar_y - 8,5,5); //feet
        rect(gameChar_x - 2,gameChar_y - 13,5,10); //feet
    
        fill(200,0,0);
        rect(gameChar_x - 7,gameChar_y - 28,15,20); //torso
    
        fill(240);
        ellipse(gameChar_x,gameChar_y - 36,17,17); //face
    
        fill(240);
        triangle(gameChar_x + 3,gameChar_y - 27,
                 gameChar_x + 14,gameChar_y - 12,
                 gameChar_x + 8,gameChar_y - 33); //beard
    
        fill(100,100,100);
        ellipse(gameChar_x - 1,gameChar_y - 69,7,7); //pom pom on hat
    
        fill(200,0,0);
        triangle(gameChar_x - 8,gameChar_y - 43,
                 gameChar_x - 1,gameChar_y - 68,
                 gameChar_x + 7,gameChar_y - 43); //hat
    
        strokeWeight(2);
        point(gameChar_x + 7,gameChar_y - 39); //eye
    
        strokeWeight(1);
        line(gameChar_x + 6,gameChar_y - 35,
             gameChar_x + 8,gameChar_y - 35); //mouth
    
        quad(gameChar_x + 2,gameChar_y - 48,
             gameChar_x - 1,gameChar_y - 48,
             gameChar_x - 1,gameChar_y - 24,
             gameChar_x + 2,gameChar_y - 24); //arm
    
        fill(240);
        ellipse(gameChar_x,gameChar_y - 48,4,4); //hand
	}
	else if(isLeft)
	{
        fill(0);
        stroke(0);
        strokeWeight(1);
        
        rect(gameChar_x - 4,gameChar_y - 3,5,5); //feet
        rect(gameChar_x,gameChar_y - 8,5,10); //feet
    
        fill(200,0,0);
        rect(gameChar_x - 7,gameChar_y - 28,15,20); //torso
    
        fill(240);
        ellipse(gameChar_x,gameChar_y - 36,17,17); //face
    
        fill(240);
        triangle(gameChar_x - 3,gameChar_y - 27,
                 gameChar_x - 14,gameChar_y - 12,
                 gameChar_x - 8,gameChar_y - 33); //beard
    
        fill(100,100,100);
        ellipse(gameChar_x - 1,gameChar_y - 69,7,7); //pom pom on hat
    
        fill(200,0,0);
        triangle(gameChar_x - 8,gameChar_y - 43,
                 gameChar_x - 1,gameChar_y - 68,
                 gameChar_x + 7,gameChar_y - 43); //hat
    
        strokeWeight(2);
        point(gameChar_x - 7,gameChar_y - 39); //eye
    
        strokeWeight(1);
        line(gameChar_x - 6,gameChar_y - 35,
             gameChar_x - 8,gameChar_y - 35); //mouth
    
        quad(gameChar_x + 2,gameChar_y - 28,
             gameChar_x - 1,gameChar_y - 28,
             gameChar_x - 1,gameChar_y - 14,
             gameChar_x + 2,gameChar_y - 14); //arm
    
        fill(240);
        ellipse(gameChar_x,gameChar_y - 13,4,4); //hand
	}
	else if(isRight)
	{
        fill(0);
        stroke(0);
        strokeWeight(1);
        
        rect(gameChar_x + 2,gameChar_y - 3,5,5);
        rect(gameChar_x - 2,gameChar_y - 8,5,10); //feet
    
        fill(200,0,0);
        rect(gameChar_x - 7,gameChar_y - 28,15,20); //torso
    
        fill(240);
        ellipse(gameChar_x,gameChar_y - 36,17,17); //face
    
        fill(240);
        triangle(gameChar_x + 3,gameChar_y - 27,
                 gameChar_x + 14,gameChar_y - 12,
                 gameChar_x + 8,gameChar_y - 33); //beard
    
        fill(100,100,100);
        ellipse(gameChar_x - 1,gameChar_y - 69,7,7); //pom pom on hat
    
        fill(200,0,0);
        triangle(gameChar_x - 8,gameChar_y - 43,
                 gameChar_x - 1,gameChar_y - 68,
                 gameChar_x + 7,gameChar_y - 43); //hat
    
        strokeWeight(2);
        point(gameChar_x + 7,gameChar_y - 39); //eye
    
        strokeWeight(1);
        line(gameChar_x + 6,gameChar_y - 35,
             gameChar_x + 8,gameChar_y - 35); //mouth
    
        quad(gameChar_x + 2,gameChar_y - 28,
             gameChar_x - 1,gameChar_y - 28,
             gameChar_x - 1,gameChar_y - 14,
             gameChar_x + 2,gameChar_y - 14); //arm
    
        fill(240);
        ellipse(gameChar_x,gameChar_y - 13,4,4); //hand
	}
	else if(isFalling || isPlummeting) //when game character is in air/falling
	{
		fill(0);
        stroke(0);
        strokeWeight(1);
        rect(gameChar_x - 12,  gameChar_y- 8,5,5);
        rect(gameChar_x - 7,gameChar_y - 12,5,9); //left leg
    
        rect(gameChar_x + 8 ,gameChar_y - 8,5, 5);  
        rect(gameChar_x + 3,gameChar_y - 12,5,9); //right leg
    
        fill(200,0,0);
        rect(gameChar_x - 10, gameChar_y - 25, 20,20); //torso
        
        fill(100,100,100); 
        ellipse(gameChar_x,gameChar_y - 71,7,7);  //pom pom on hat

        //hat
        fill(200,0,0);
        triangle(gameChar_x, gameChar_y-70,
                gameChar_x - 15,gameChar_y - 35,
                gameChar_x + 15,gameChar_y - 35);
    
    
        //face and beard
        fill(240);
        triangle(gameChar_x - 15, gameChar_y -35,
                gameChar_x,gameChar_y - 10,
                gameChar_x + 15,gameChar_y - 35);
    
        //left eye
        line(gameChar_x - 5,gameChar_y - 32, 
             gameChar_x - 2,gameChar_y - 32);
        
        //right eye
        line(gameChar_x + 6, gameChar_y - 32, 
             gameChar_x + 3,gameChar_y - 32);
    
        //mouth
        beginShape();
        strokeWeight(1);
        vertex(gameChar_x - 7, gameChar_y - 28);
        vertex(gameChar_x, gameChar_y - 24);
        vertex(gameChar_x + 7, gameChar_y - 28);
        vertex(gameChar_x - 6, gameChar_y - 28);
        endShape();
    
    
        //teeth
        line(gameChar_x, gameChar_y - 28, 
             gameChar_x , gameChar_y - 24);
        line(gameChar_x -3, gameChar_y - 28, 
             gameChar_x - 3 , gameChar_y - 26);
        line(gameChar_x + 3, gameChar_y - 28, 
             gameChar_x + 3,gameChar_y - 26);
    
             // left arms
        fill(200,0,0);
        quad(gameChar_x - 10,gameChar_y - 50,
             gameChar_x - 13,gameChar_y - 50,
             gameChar_x - 13,gameChar_y - 24,
             gameChar_x - 10,gameChar_y - 24);
    
            //right arm
        quad(gameChar_x + 10,gameChar_y - 50,
             gameChar_x + 13,gameChar_y - 50,
             gameChar_x + 13,gameChar_y - 24,
             gameChar_x + 10,gameChar_y - 24);
    
        //left hand
        fill(240);
        ellipse(gameChar_x - 12,gameChar_y - 50,4,4);
    
        //right hand
        ellipse(gameChar_x + 12,gameChar_y - 50,4,4); 
	}
    
    else if(gameOver)//State of character's dead body
    {
        fill(0);
        stroke(0);
        strokeWeight(1);
        rect(gameChar_x + 15,gameChar_y - 5,5,8);//legs

        fill(200,0,0);
        rect(gameChar_x - 5,gameChar_y - 10,20,10); //body

        fill(240);
        ellipse(gameChar_x - 10,gameChar_y - 5,17,17); //face

        triangle(gameChar_x - 2,gameChar_y - 2,
                     gameChar_x + 10,gameChar_y + 2,
                     gameChar_x - 8,gameChar_y + 3);//beard

        fill(100,100,100);
            ellipse(gameChar_x - 33,gameChar_y - 4,7,7);//pom pom

        fill(200,0,0);
        triangle(gameChar_x - 17,gameChar_y - 12,
                     gameChar_x - 33,gameChar_y - 4,
                     gameChar_x - 17,gameChar_y + 2); //hat

        point(gameChar_x - 14,gameChar_y); //eye

        line(gameChar_x - 11,gameChar_y + 2,gameChar_x - 11,gameChar_y - 2); //mouth

        fill(200,0,0);
        strokeWeight(1);
        quad(gameChar_x + 5,gameChar_y - 3,
                 gameChar_x + 5,gameChar_y - 5,
                 gameChar_x - 14,gameChar_y - 5,
                 gameChar_x - 14,gameChar_y - 3); //arm

        fill(240);
        ellipse(gameChar_x - 15,gameChar_y - 4,4,4);//hand

   // draw blood when gameChar in canyon
    for(var i = 30; i > 0; i -= 3) 
        {
            noStroke();
            fill(150+i,0,0,15);
            for(var j = 0; j < 10; j++)
            {
                    ellipse(gameChar_x - 20 + j * 5,gameChar_y,i,i);
                ellipse(gameChar_x - 10 + j * 3,gameChar_y + 20,5,25);
            }
        }
     
    }
	
else //draw game character when still/not moving
	{
		stroke(0);
        strokeWeight(1);
        fill(0);
        //left leg
        rect(gameChar_x - 12,gameChar_y- 3,5,5);
        rect(gameChar_x - 7,gameChar_y - 7,5,9); 
    
        //right leg
        rect(gameChar_x + 8 ,gameChar_y - 3,5, 5);  
        rect(gameChar_x + 3,gameChar_y -7,5,9);
    
        //torso
        fill(200,0,0);
        rect(gameChar_x - 10, gameChar_y - 25, 20,20);
        
        //pom pom on hat
        fill(100,100,100); 
        ellipse(gameChar_x,gameChar_y - 71,7,7); 
    
        //hat
        fill(200,0,0);
        triangle(gameChar_x, gameChar_y-70,
                gameChar_x - 15,gameChar_y - 35,
                gameChar_x + 15,gameChar_y - 35);
    
    
        //face and beard
        fill(240);
        triangle(gameChar_x - 15, gameChar_y -35,
                gameChar_x,gameChar_y - 10,
                gameChar_x + 15,gameChar_y - 35);
    
        //left eye
        line(gameChar_x - 5,  gameChar_y - 32, 
             gameChar_x - 2, gameChar_y - 32);
        
        //right eye
        line(gameChar_x + 6, gameChar_y - 32, 
             gameChar_x + 3, gameChar_y - 32);
    
        //mouth
        beginShape();
        strokeWeight(1);
        vertex(gameChar_x - 7, gameChar_y - 28);
        vertex(gameChar_x, gameChar_y - 24);
        vertex(gameChar_x + 7, gameChar_y - 28);
        vertex(gameChar_x - 6, gameChar_y - 28);
        endShape();
    
         //teeth
        line(gameChar_x, gameChar_y - 28, 
             gameChar_x , gameChar_y - 24);
        line(gameChar_x -3, gameChar_y - 28, 
             gameChar_x -3 ,gameChar_y - 26);
        line(gameChar_x + 3,gameChar_y - 28, 
             gameChar_x + 3,gameChar_y - 26);
        
             // left arms
        fill(200,0,0);
        quad(gameChar_x - 10,gameChar_y - 25,
             gameChar_x - 13,gameChar_y - 25,
             gameChar_x - 13,gameChar_y - 12,
             gameChar_x - 10,gameChar_y - 12);
    
            //right arm
        quad(gameChar_x + 10,gameChar_y - 25,
             gameChar_x + 13,gameChar_y - 25,
             gameChar_x + 13,gameChar_y - 12,
             gameChar_x + 10,gameChar_y - 12);
    
        //left hand
        fill(240);
        ellipse(gameChar_x - 12,gameChar_y - 10,4,4);
    
        //right hand
        ellipse(gameChar_x + 12,gameChar_y - 10,4,4); 
  
    }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawCloud()
{
    for(var i = 0; i < clouds.length; i++)
    {
        noStroke();
        fill(255,255,255); 
        ellipse(clouds[i].pos_X,clouds[i].pos_Y,
                clouds[i].width,clouds[i].height);
        ellipse(clouds[i].pos_X + 20,clouds[i].pos_Y - 20,
                clouds[i].width,clouds[i].height);
        ellipse(clouds[i].pos_X + 30,clouds[i].pos_Y + 20,
                clouds[i].width,clouds[i].height);
        ellipse(clouds[i].pos_X + 60,clouds[i].pos_Y,
                clouds[i].width,clouds[i].height);
        ellipse(clouds[i].pos_X + 60,clouds[i].pos_Y + 20,
                clouds[i].width + 20,clouds[i].height + 20);
        ellipse(clouds[i].pos_X + 60,clouds[i].pos_Y - 20,
                clouds[i].width + 20,clouds[i].height + 20);
        ellipse(clouds[i].pos_X + 100,clouds[i].pos_Y,
                clouds[i].width + 30,clouds[i].height + 30);
    }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
    {
        stroke(0);
        strokeWeight(1);
        fill(100);
        triangle(mountains[i].pos_X,mountains[i].pos_Y,
                 mountains[i].pos_X + (mountains[i].width/1.5),floorPos_y - mountains[i].height,
                 mountains[i].pos_X + mountains[i].width,mountains[i].pos_Y);
        triangle(
            mountains[i].pos_X + 100,mountains[i].pos_Y,
            mountains[i].pos_X + (mountains[i].width/0.99),mountains[i].pos_Y - (mountains[i].height + 30),
            mountains[i].pos_X + 370,mountains[i].pos_Y);
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        noStroke();
        fill(140,50,40);
        rect(trees_x[i],
             floorPos_y - 150,
             40,
             151);
        fill(0,110,0);
        ellipse(trees_x[i] - 12,
                floorPos_y - 140,
                100);
        ellipse(trees_x[i] - 12,
                floorPos_y - 168,
                100);
        ellipse(trees_x[i] + 13,
                floorPos_y - 188,
                100);
        ellipse(trees_x[i] + 38,
                floorPos_y - 178,
                100);
        ellipse(trees_x[i] + 48,
                floorPos_y - 148,
                100);
        ellipse(trees_x[i] + 28,
                floorPos_y - 148,
                100);
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
    //canyon body
    noStroke();
    fill(101,67,33);
    rect(t_canyon.pos_X - 2,
         t_canyon.pos_Y,
         t_canyon.width,
         window.innerHeight - t_canyon.pos_Y);
    
    for(var i = 0; i < 7; i ++)
    {   
        //Arrows
         stroke(0);
         line(t_canyon.pos_X + 8 + i * 14,
         t_canyon.pos_Y + 200,
         t_canyon.pos_X + 8 + i * 14,
         t_canyon.pos_Y + 100);
        
         line(t_canyon.pos_X + 11 + i * 14,
         t_canyon.pos_Y + 200,
         t_canyon.pos_X + 11 + i * 14,
         t_canyon.pos_Y + 100);
        
        fill(0,0,128);
         triangle(t_canyon.pos_X + 5 + i * 14,
         t_canyon.pos_Y + 100,
         t_canyon.pos_X + 10 + i * 14,
         t_canyon.pos_Y + 95,
         t_canyon.pos_X + 15 + i * 14,
         t_canyon.pos_Y + 100);
    }

}

// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.pos_X + 8 && gameChar_world_x < t_canyon.pos_X + t_canyon.width - 8 && gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
    }
    //if gamecharacter is on spikes then make gameover character true and stop it from moving and jumping
    if(gameChar_y >= floorPos_y + 90)
        {
            isPlummeting = false;
            gameOver = true;
            isLeft = false;
            isRight = false;
        }

}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
    fill(0,0,200);
    ellipse(t_collectable.pos_X,
            t_collectable.pos_Y,
            t_collectable.size,
            t_collectable.size);
    fill(255,220,0);
    triangle(t_collectable.pos_X - 20,
             t_collectable.pos_Y,
             t_collectable.pos_X,
             t_collectable.pos_Y - 20,
             t_collectable.pos_X + 20,
             t_collectable.pos_Y);
    fill(100,20,190);
    triangle(t_collectable.pos_X - 10,
             t_collectable.pos_Y,
             t_collectable.pos_X,
             t_collectable.pos_Y - 10,
             t_collectable.pos_X + 10,
             t_collectable.pos_Y);
    fill(255,220,0);
    triangle(t_collectable.pos_X - 20,
             t_collectable.pos_Y,
             t_collectable.pos_X,
             t_collectable.pos_Y + 20,
             t_collectable.pos_X + 20,
             t_collectable.pos_Y);
    fill(100,20,190);
    triangle(t_collectable.pos_X - 10,
             t_collectable.pos_Y,
             t_collectable.pos_X,
             t_collectable.pos_Y + 10,
             t_collectable.pos_X + 10,
             t_collectable.pos_Y);
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    var d = dist(gameChar_world_x,gameChar_y,t_collectable.pos_X,t_collectable.pos_Y);
    if(d <= 30)
        {
            coinCollect.play();
            score += 1;
            t_collectable.isFound = true;
        }
}

//Function to draw flagpole
function DrawFlagpole(){
    //flagpole when it hasnt been reached
    if(flagpole.Reached == false)
        {
            fill(128,0,0)
            triangle(flagpole.x_pos, floorPos_y - 100,
                     flagpole.x_pos, floorPos_y - 50, flagpole.x_pos + 100, floorPos_y - 75)
            fill(218,165,32)
            rect(flagpole.x_pos,floorPos_y - 200,10,200)
        }
    //flagpole when its reached
    if(flagpole.Reached == true)
        {
            fill(100,0,100)
            triangle(flagpole.x_pos, floorPos_y - 200,
                     flagpole.x_pos, floorPos_y - 150, flagpole.x_pos + 100, floorPos_y - 175)
            fill(218,165,32)
            rect(flagpole.x_pos,floorPos_y - 200,10,200)
        }
}

//Function to check flagpole has been reached
function checkFlagpole()
{
    //check if character is at flagpole and stop character from moving after it has reached
    if (gameChar_world_x > flagpole.x_pos){
        flagpole.Reached = true;
        isLeft = false;
        isRight = false;
        isFalling = false;
    }
}

//Function to create platforms
function createPlatform(x,y,size)
{
    var plat = {
        x: x,
        y: y,
        size: size,
        create: function() 
                {
                    fill(128,128,0);
                    rect(this.x,this.y,this.size,5);
                },
        check: function(cx,cy)
        {
            if(cx > this.x && cx < this.x + this.size)
                {
                    if(this.y - gameChar_y == 0)
                        {
                            return true;
                        }
                    else
                    {
                    return false;
                    }
                }
        }
    }
    return plat;
}

//constructor function to create enemies
function Enemy(x, y, range, axis, type) 
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.current_y = y;
    this.axis = axis;
    this.incr = 2;
    this.Boss = type;
    
    this.draw = function() //function to draw enemies
    {
        
        if(this.axis == "x" && this.Boss != "Boss") //draw enemies moving on the x-axis and are not boss
            {
                fill(100,100,255);
                //face
                ellipse(this.current_x,this.current_y - 20,40,30);
                
                //mouth && teeth
                line(this.current_x - 7, this.current_y - 12, this.current_x + 7, this.current_y - 12);
                triangle(this.current_x - 8,this.current_y - 12,
                    this.current_x - 8, this.current_y - 10,
                    this.current_x - 6, this.current_y - 12);
                triangle(this.current_x + 8,this.current_y - 12,
                    this.current_x + 8, this.current_y - 10,
                    this.current_x + 6, this.current_y - 12);
                
                //legs
                fill(128,0,0);
                ellipse(this.current_x - 5,this.current_y - 3,10,5);
                ellipse(this.current_x + 7,this.current_y - 3,10,5);

                //eyes
                fill(200);
                ellipse(this.current_x - 5,this.current_y - 20,10,10);
                fill(0);
                ellipse(this.current_x - 5,this.current_y - 18,5,5);
                fill(200);
                ellipse(this.current_x + 5, this.current_y - 20,10);
                fill(0);
                ellipse(this.current_x + 5, this.current_y - 18,5);
                line(this.current_x - 7, this.current_y - 12, this.current_x + 7, this.current_y - 12);
                }
                
        if(this.axis == "y" && this.Boss != "Boss") //draw enemies moving on the y-axis and are not boss enemy
            {
                //face
                fill(100,100,255);
                ellipse(this.current_x,this.current_y - 20,40,30);
                fill(200);
                ellipse(this.current_x, this.current_y - 22,15);
                fill(0);
                ellipse(this.current_x, this.current_y - 19,8);

                //mouth && teeth
                line(this.current_x - 7,this.current_y - 12,this.current_x + 7, this.current_y- 12);
                triangle(this.current_x - 8,this.current_y - 12,
                        this.current_x - 8, this.current_y - 10,
                        this.current_x - 6, this.current_y - 12);

                triangle(this.current_x + 8,this.current_y - 12,
                        this.current_x + 8, this.current_y - 10,
                        this.current_x + 6, this.current_y - 12);
                
                //wings
                fill(0);
                triangle(this.current_x + 15,this.current_y - 30,
                        this.current_x + 25,this.current_y - 47,
                        this.current_x + 40, this.current_y - 25);
                triangle(this.current_x - 15,this.current_y - 30,
                        this.current_x - 25,this.current_y - 47,
                        this.current_x - 40, this.current_y - 25);
            }
        if(this.axis == "x" && this.Boss == "Boss") //draw enemies moving on x-axis and are boss enemy
            {
                fill(12,120,10);
                triangle(this.current_x-20,this.current_y-35,this.current_x-10,this.current_y-45,this.current_x,this.current_y-35);
                triangle(this.current_x,this.current_y-35,this.current_x+10,this.current_y-45,this.current_x+20,this.current_y-35);
                fill(128,0,0);
                rect(this.current_x- 20,this.current_y - 35,40,30);
                
                //mouth && teeth
                line(this.current_x - 7, this.current_y - 12, this.current_x + 7, this.current_y - 12);
                triangle(this.current_x - 8,this.current_y - 12,
                    this.current_x - 8, this.current_y - 10,
                    this.current_x - 6, this.current_y - 12);
                triangle(this.current_x + 8,this.current_y - 12,
                    this.current_x + 8, this.current_y - 10,
                    this.current_x + 6, this.current_y - 12);

                //eyes
                fill(0);
                quad(this.current_x - 10, this.current_y - 30,this.current_x - 2,this.current_y - 26,this.current_x - 2,this.current_y - 23,this.current_x - 10, this.current_y-26);
                quad(this.current_x + 10, this.current_y - 30,this.current_x + 2,this.current_y - 26,this.current_x + 2,this.current_y - 23,this.current_x + 10, this.current_y-26);
                fill(200);
                ellipse(this.current_x - 5,this.current_y - 20,10,10);
                fill(0);
                ellipse(this.current_x - 5,this.current_y - 18,5,5);
                fill(200);
                ellipse(this.current_x + 5, this.current_y - 20,10);
                fill(0);
                ellipse(this.current_x + 5, this.current_y - 18,5);
                line(this.current_x - 7, this.current_y - 12, this.current_x + 7, this.current_y - 12);
                
                 //wings
                fill(0);
                triangle(this.current_x + 15,this.current_y - 30,
                        this.current_x + 25,this.current_y - 47,
                        this.current_x + 40, this.current_y - 25);
                triangle(this.current_x - 15,this.current_y - 30,
                        this.current_x - 25,this.current_y - 47,
                        this.current_x - 40, this.current_y - 25);
            }
        

    },
        
    //function to make enemies move
    this.update = function() 
    {
        if(this.axis == "x" && this.Boss != "Boss")
            {
                this.current_x += this.incr;

                if(this.current_x < this.x) {
                    this.incr = 2;
                }
                else if(this.current_x > this.x + this.range) {
                    this.incr -= 2;
                }
            }
        if(this.axis == "y" && this.Boss != "Boss")
            {
                this.current_y += this.incr;
                
                if(this.current_y < this.y)
                    {
                        this.incr = 2;
                    }
                else if(this.current_y > this.y + this.range)
                    {
                        this.incr -= 2;
                    }
            }
        
    }
    
    //function to make boss enemy move towards game character
    this.bossUpdate = function()
    {
        if(this.axis == "x" && this.Boss == "Boss")
            {
                //stop the boss enemy from moving to wards gamecharacter when flagpole is reached
                if(gameChar_world_x > 2100 && gameChar_world_x < flagpole.x_pos)
                    {
                        if(gameChar_world_x < this.current_x){
                            this.current_x -= 2;
                        }
                        else if(gameChar_world_x > this.current_x)
                            {
                                this.current_x += 2;
                            }
                        
                    }
            }
    }
    
    //function to check if game character has touched an enemy
    this.isContact = function(gc_x, gc_y) {
    // returns true if contact is made

    var d = dist(gc_x, gc_y, this.current_x, this.current_y)

    if(d < 35) 
    {

        return true;
    }

    return false;

    }
}