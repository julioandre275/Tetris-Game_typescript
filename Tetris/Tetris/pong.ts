// FIT2102 2018 Assignment 1
// https://docs.google.com/document/d/1woMAgJVf1oL3M49Q8N3E1ykTuTu5_r28_MQPVS5QIVo/edit?usp=sharing

function pong() {
  // Inside this function you will use the classes and functions 
  // defined in svgelement.ts and observable.ts
  // to add visuals to the svg element in pong.html, animate them, and make them interactive.
  // Study and complete the tasks in basicexamples.ts first to get ideas.

  // You will be marked on your functional programming style
  // as well as the functionality that you implement.
  // Document your code!  
  // Explain which ideas you have used ideas from the lectures to 
  // create reusable, generic functions.
    const svg = document.getElementById("canvas")!,
    mousemove = Observable.fromEvent<MouseEvent>(svg, 'mousemove');
    //Creating the rectangle ball and then textbox to keep the score
    const rect = new Elem(svg, 'rect')
      .attr('x', 0).attr('y', 300)
      .attr('width', 10).attr('height', 80)
      .attr('fill', '#FFFFFF'),
    rect2 = new Elem(svg, 'rect')
    .attr('x', 590).attr('y', 300)
    .attr('width', 10).attr('height', 80)
    .attr('fill', '#FFFFFF'),
    ball = new Elem(svg,'circle')
      .attr('cx', 300)
      .attr('cy',300)
      .attr('r', 10)
      .attr('fill', 'blue'),
    score = new Elem(svg, 'text')
      .attr('x',100)
      .attr('y',30)
      .attr('font-size',30)
      .attr('fill', 'blue'),
    score2 = new Elem(svg, 'text')
    .attr('x',400)
    .attr('y',30)
    .attr('font-size',30)
    .attr('fill', 'blue')  
    //Setting the scores to 0 for each player
    score.elem.textContent = '0'
    score2.elem.textContent = '0'
    
  //Setting the speed of th ball and the speed of the AI pedal and the score counter
  let dy: number = -1
  let dt: number = -0.5
  let dv: number = -1
  let sc1: number = 0
  let sc2: number = 0

  //at every 1 second check if the mouse movement and move the pedal accordingly
  //and if its more or less than the canvas keep the pedal in the canvas
  Observable.interval(1)
  
    //let o= Observable.interval(10)
      //.takeUntil(Observable.interval(10000))
    //  .map(()=>rect.attr('y', speed+Number(rect.attr('y'))));
    //at every 1 second check if the mouse movement and move the pedal accordingly
    rect2.observe<MouseEvent>('mousemove')
    .map(({clientX, clientY}) => ({ xOffset: Number(rect2.attr('x')) - clientX,
                                    yOffset: Number(rect2.attr('y')) - clientY }))
    .flatMap(({yOffset}) =>mousemove
      .map(({clientY}) => ({ y: clientY + yOffset })))
  //.filter(({y})=> y >= 520)
  //.map(({y})=>({y:520}))
  .subscribe(({y}) =>rect2.attr('y', y));
  //at every 1 second check if the mouse movement and move the pedal accordingly
  //and if its more or less than the canvas keep the pedal in the canvas
  rect2.observe<MouseEvent>('mousemove')
  .map(({clientX, clientY}) => ({ xOffset: Number(rect2.attr('x')) - clientX,
                                  yOffset: Number(rect2.attr('y')) - clientY }))
  .flatMap(({yOffset}) =>mousemove
    .map(({clientY}) => ({ y: clientY + yOffset })))
  .filter(({y})=> y+80 >= 600)
  .map(()=>({y:520}))
  .subscribe(({y}) =>rect2.attr('y', y));
  //at every 1 second check if the mouse movement and move the pedal accordingly
  //and if its more or less than the canvas keep the pedal in the canvas
  rect2.observe<MouseEvent>('mousemove')
  .map(({clientX, clientY}) => ({ xOffset: Number(rect2.attr('x')) - clientX,
                                  yOffset: Number(rect2.attr('y')) - clientY }))
  .flatMap(({yOffset}) =>mousemove
    .map(({clientY}) => ({ y: clientY + yOffset })))
  .filter(({y})=> y <= 0)
  .map(()=>({y:0}))
  .subscribe(({y}) =>rect2.attr('y', y));
      //Move the Ai pedal
    Observable.interval(1)
    .map(() => rect.attr('y', Number(rect.attr('y')) + dv))
    .subscribe(e=>e) 
      //If the pedal is less than the canvas
    Observable.interval(1)
    .filter(()=> Number(rect.attr('y')) === 0)
    .map(() => dv = -dv)
    .subscribe(e=>e) 
    //if the pedal is greater than the canvas
    Observable.interval(1)
    .filter(()=> Number(rect.attr('y')) === 520)
    .map(() => dv = -dv)
    .subscribe(e=>e) 

    // Move the ball 
    Observable.interval(1)
    .map(() => ball.attr('cy', Number(ball.attr('cy')) + dy))
    .map(() => ball.attr('cx', Number(ball.attr('cx')) + dt))
    .subscribe(e=>e) 
      //if the ball is less than canvas move the other way
    Observable.interval(1)
    .filter(()=> Number(ball.attr('cy')) === 0)
    .map(() => dy = -dy)
    .subscribe(e=>e)
    //If the ball is greater than canvas move the other way
    Observable.interval(1)
    .filter(()=> Number(ball.attr('cy')) === 590)
    .map(() => dy = -dy)
    .subscribe(e=>e)
    //If the ball hits the pedal move in opposite direction
    Observable.interval(1)
    .filter(()=> Number(ball.attr('cy')) >= Number(rect2.attr('y')) && Number(ball.attr('cy'))<= Number(rect2.attr('y'))+80 && Number(ball.attr('cx'))===590)
    .map(() => dt = -dt)
    .subscribe(e=>e)
    //If the ball hits the pedal move in opposite direction
    Observable.interval(1)
    .filter(()=> Number(ball.attr('cy')) >= Number(rect.attr('y')) && Number(ball.attr('cy'))<= Number(rect.attr('y'))+80 && Number(ball.attr('cx'))===10)
    .map(() => dt = -dt)
    .subscribe(e=>e)
    //Updating the score when the pedal doesnt get the ball
    Observable.interval(1)
    .filter(()=> Number(ball.attr('cx'))<=0)
    .map(() => sc2 +=1)
    .subscribe(()=>{ball.attr('cx', 300).attr('cy', 300); score2.elem.textContent = String(sc2)});
    //Updating the score when the pedal doesnt get the ball
    Observable.interval(1)
    .filter(()=> Number(ball.attr('cx'))>590)
    .map(() => sc1 +=1)
    .subscribe(()=>{ball.attr('cx', 300).attr('cy', 300); score.elem.textContent = String(sc1)});
    //End the game if score gets to 11
    Observable.interval(1)
    .filter(()=> Number(sc1)>=11)
    .subscribe(()=> {dy = 0;dv=0;dt=0;score.elem.textContent = String("WINNER")});   
    //End the game if score gets to 11
    Observable.interval(1)
    .filter(()=> Number(sc2)>=11)
    .subscribe(()=> {dy = 0;dv=0;dt=0;score2.elem.textContent = String("WINNER")});   
    

   



    

   
      
      // o.filter(()=>Number(rect.attr('y'))+80<=600)
      // o.map(()=>speed = -speed)
      // .subscribe(()=>rect.attr('y', Number(rect.attr('y'))+speed));
      // o.filter(()=>Number(rect.attr('y'))==0)
      // o.map(()=>speed = -speed)
      // .subscribe(()=>rect.attr('y', speed+Number(rect.attr('y'))));


        
  }

// the following simply runs your pong function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = ()=>{
    pong();
  }

 

 