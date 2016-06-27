function Chain(){

	var ctx = canva.getContext("2d");
	var width = canva.width;
	var height = canva.height;
	
	var ctx2 = canvaEn.getContext("2d");
	var width2 = canvaEn.width;
	var height2 = canvaEn.height;
	
	var Part = [];

	var N = 14;
		
	var step = 10;
	var fps = 30;
   
	var T = 0;
	var T0 = 1; 
	var m = 1;
		
	var radius = 17;
	var pBegin = 2.5 * radius / 5;
	var dt = 0.1 * T0 /fps;
	
	var C0 = 100;
	var C1 = 700;
	
	var w0 = Math.sqrt(C0/m);
	var w1 = Math.sqrt(C1/m);
		
	var Energy = [];
	var Energy0kinEn = 0;
	var Energy1kinEn = 0;
	var Energy0potEn = 0;
	var Energy1potEn = 0;
		
	var NowKinEn = 0;
	var NowPotEn = 0;
	var maxEn0 = 0;
	var maxEn1 = 0;
	
	
    New.onclick = function() {

         N = +(document.getElementById('number_input').value);

		Part =[];
        Energy = [];
        createParticles();

         T = 0;
         ctx.clearRect(0, 0, width, height);
         ctx2.clearRect(0, 0, width2, height2);
         ctx3.clearRect(0, 0, width3, height3);

    }
	
    function createParticles(){
        for (var i = 1; i < N + 1; ++i){
			var p = {}; // отдельная частичка
			p.x0 = pBegin*2.5*i; // Вычисление начального положения каждой массы
			p.fu = 0;
			//if (i == 10) {
			p.vu = (Math.random()-0.5) * 30;
			//}
			//else p.vu = 0;
			p.uu = 0; // начальное смещение каждой массы
			p.kinEn = 0; // Кинетическая энергия системы
			p.potEn = 0; // Потенциальная энергия системы
            
			Part[i] = p;
       		}
		Part[0] = Part[N];
		Part[N+1] = Part[1];
    }
	
	createParticles()
	
	function launch(){
        physics();
        drawModel();	
		drawEnergy();
		shiftEnergy();
    }
		
	function physics(){
        NowKinEn = 0;
        NowPotEn = 0;
		for (var s=1; s<=step; s++){            
			for (var i=1; i<Part.length-1; i++){
				Part[i].fu = w0*(Part[i+1].uu - 2*Part[i].uu + Part[i-1].uu)-w1*Part[i].uu;
				Part[i].vu += Part[i].fu * dt;
				Part[i].kinEn = m * Math.pow(Part[i].vu, 2) / 2;
				NowKinEn += Part[i].kinEn;
			}
		
			Part[0].vu = 0;
            Part[N+1].vu = 0;
			
			for (i=1; i<Part.length-1; i++){
				Part[i].uu += Part[i].vu * dt;
				Part[i].potEn = C0 * Math.pow((Part[i].uu - Part[i-1].uu), 2) / 2;
                NowPotEn += Part[i].potEn;
			}
		}
		T += dt;
        if (T > 900/400) {
            T = 0;
            ctx2.clearRect(0, 0, width2, height2);
        }
		maxEn1 = Energy1kinEn + Energy1potEn;
		Energy1kinEn = NowKinEn;
		Energy1potEn = NowPotEn;
		//console.log("physics", Energy0kinEn, Energy1kinEn);
	}
		
	function drawModel(){
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = "#0a17ca";
		for(i = 0; i < N + 1; ++i){
			ctx.beginPath();
			if ( i % 7 === 0) ctx.fillStyle = "#FFA07A";
            else if ( i % 6 === 0) ctx.fillStyle = "#008080";
			else if ( i % 5 === 0) ctx.fillStyle = "#3CB371";
			else if ( i % 4 === 0) ctx.fillStyle = "#6B8E23";
			else if ( i % 3 === 0) ctx.fillStyle = "#87CEEB";
			else if ( i % 2 === 0) ctx.fillStyle = "#D8BFD8";
			else ctx.fillStyle = "#DA70D6";
			ctx.arc(Part[i].x0 + Part[i].uu * 0.5*width / (N) / 10 - 5, height/2, radius * 10 / N , 0, 2 * Math.PI);
			ctx.fill();
			ctx.fillStyle = "#000000";
			ctx.moveTo(Part[i].x0 + Part[i].uu * 0.5*width / (N) / 10 - 5, height/2);
			ctx.lineTo(Part[i+1].x0 + Part[i+1].uu * 0.5*width / (N) / 10 - 5, height/2);
			ctx.stroke();
			
			ctx.fillStyle = "#000000";
			ctx.moveTo(Part[i].x0 + Part[i].uu * 0.5*width / (N) / 10 - 5, height/2);
			ctx.lineTo(Part[i].x0 + Part[i+1].x0  / (N) / 10 - 5, height);
			ctx.stroke();
		}
	}
	
	function drawEnergy(){
		//ctx2.clearRect(0, 0, width, height);
		ctx2.fillStyle = "#0a17ca";
		
		ctx2.lineWidth="3";
        ctx2.strokeStyle="#A52A2A";
        ctx2.beginPath();

        ctx2.moveTo(10, 10);
        ctx2.lineTo(20, 10);
        ctx2.fillText('Kinetic Energy', 25, 10);
		
		if (maxEn0 != 0) {
			ctx2.moveTo((T - dt) * 400 , height2 - (Energy0kinEn / maxEn0 * (height2 - 5))*2);
			ctx2.lineTo(T * 400, height2 - (Energy1kinEn / maxEn1 * (height2 - 5))*2);
			ctx2.stroke();
		}
		
		ctx2.lineWidth="3";
        ctx2.strokeStyle="#4682B4";
        ctx2.beginPath();

        ctx2.moveTo(110, 10);
        ctx2.lineTo(120, 10);
        ctx2.fillText('Potential Energy', 125, 10);
		
		if (maxEn0 != 0){
			ctx2.moveTo((T - dt) * 400 , height2-10  - (Energy0potEn / maxEn0 * (height2 - 20))/8);
			ctx2.lineTo(T * 400, height2-10 - (Energy1potEn / maxEn1 * (height2 - 20))/8);
			ctx2.stroke();
		}
		
		console.log("drawmove", (T - dt) * 200, height2 - Energy0potEn / maxEn0 * (height2 - 5));
		console.log("drawline", T * 200, height2 - Energy1potEn / maxEn1 * (height2 - 5));
		
	}
	
	function shiftEnergy(){
		//console.log("shift1", Energy0kinEn, Energy1kinEn);
		Energy0kinEn = Energy1kinEn;
		Energy0potEn = Energy1potEn;
		maxEn0 = maxEn1;
		//console.log("shift2", Energy0kinEn, Energy1kinEn); 
	}
	setInterval(launch, 5000/fps);
}
