var container, stats, raycaster, mouse;
var camera, scene, renderer, controls, clock;

var dragIndex, dragVec, dragOffset, dragHue, targetList;
var bottomСonnector, topСonnectors, connections;
var bCoffset, tCoffset;
var plane, pulsar;
var branchList;
var cameraVec = new THREE.Vector3(25,25,25);
var branchSize = new THREE.Vector2(24,72);
var branchCount =  new THREE.Vector2(5,5);
var branchOffset = new THREE.Vector3()//-72*branchCount.x/2,-72*branchCount.y/2,0.1);
var colorHelper = [0, 30/360, 60/360, 120/360, 180/360, 240/360, 270/360];
var stringColor = {
	0: "red", 30 : "orange", 60: "yellow", 120 : "green", 180: "aqua", 240 : "blue", 270 : "indigo"
};

init();
animate();
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x909090 );
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.add(cameraVec);
	scene.add( camera );
	var light = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( light );
	clock = new THREE.Clock();
	tick = 0;

  var divisions = 100, s = 100;
  var gridHelper = new THREE.GridHelper( s, divisions );
  scene.add( gridHelper );
	var axesHelper = new THREE.AxesHelper( branchSize.x*100 );
	scene.add( axesHelper );

	var geometry = new THREE.PlaneBufferGeometry( s, s, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
	plane = new THREE.Mesh( geometry, material );

	controls = new THREE.OrbitControls( camera);

	let pointA = new THREE.Vector3(0,0,0);
	let pointB = new THREE.Vector3(0,0,0);
	let pointC = new THREE.Vector3(0,0,0);
	let under = new THREE.Vector3(17/5,-35/19,22/6);
	let above = new THREE.Vector3(9,159/15,31/5);
	let aboveBerch = new THREE.Vector3(-1,7,3);
	let sum = 17;
	pointA = under.clone();
	pointB = under.clone();
	pointC = under.clone();
	pointA.x = sum - under.y - under.z;
	pointB.y = sum - under.z - under.x;
	pointC.z = sum - under.x - under.y;
	above.x = sum - above.x;
	above.y = sum - above.y;
	above.z = sum - above.z;
	aboveBerch.x = sum - aboveBerch.x;
	aboveBerch.y = sum - aboveBerch.y;
	aboveBerch.z = sum - aboveBerch.z;

	/*console.log('PointA:',pointA,'PointB:',pointB,'PointC:',pointC )
	console.log( 'Antagonistic' )
	console.log( above.x + ' >= x >= ' + under.x )
	console.log( above.y + ' >= y >= ' + under.y )
	console.log( above.z + ' >= x >= ' + under.z )
	console.log( 'x + y + z = ' + sum )
	console.log( 'Berge equilibrium' )
	console.log( aboveBerch.x + ' >= x >= ' + under.x )
	console.log( aboveBerch.y + ' >= y >= ' + under.y )
	console.log( aboveBerch.z + ' >= x >= ' + under.z )
	console.log( 'x + y + z = ' + sum )*/

	var geometry = new THREE.Geometry();
	geometry.vertices = [
		pointA, pointB, pointC
	];
	geometry.faces = [new THREE.Face3(0,1,2)];
	var main = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }) );
	scene.add(main);

	let dots = [];
	dots.push( limitedLineFromTwoPointsFixed( pointA, pointB, null, new THREE.Vector3(0,above.y,0) ) );
	dots.push( limitedLineFromTwoPointsFixed( null, pointB, pointC, new THREE.Vector3(0,above.y,0) ) );
	dots.push( limitedLineFromTwoPointsFixed( pointA, null, pointC, new THREE.Vector3(0,0,above.z) ) );
	dots.push( limitedLineFromTwoPointsFixed( null, pointB, pointC, new THREE.Vector3(0,0,above.z) ) );
	dots.push( limitedLineFromTwoPointsFixed( pointA, pointB, null, new THREE.Vector3(above.x,0,0) ) );
	dots.push( limitedLineFromTwoPointsFixed( pointA, null, pointC, new THREE.Vector3(above.x,0,0) ) );
	/*dots.push( limitedLineFromTwoPoints( pointA, pointB, null, new THREE.Vector3(0,above.y,0) ) );
	dots.push( limitedLineFromTwoPoints(  null, pointB, pointC, new THREE.Vector3(0,above.y,0) ) );
	dots.push( limitedLineFromTwoPoints( pointA, null, pointC, new THREE.Vector3(0,0,above.z) ) );
	dots.push( limitedLineFromTwoPoints(  null, pointB, pointC, new THREE.Vector3(0,0,above.z) ) );
	dots.push( limitedLineFromTwoPoints( pointA, pointB, null,  new THREE.Vector3(above.x,0,0) ) );
	dots.push( limitedLineFromTwoPoints( pointA, null,  pointC, new THREE.Vector3(above.x,0,0) ) );*/

	let center = new THREE.Vector3(0,0,0);
	for( let i = 0; i < dots.length; i++ )
		center.add( dots[i] );
	center.divideScalar( dots.length );
	dots.push( center );

	for( let i = 0; i < dots.length; i++ )
		dots[i].y += 0.001;

	geometry = new THREE.Geometry();
	geometry.vertices = dots;
	geometry.faces = [
		new THREE.Face3(6,4,0),
		new THREE.Face3(6,0,1),
		new THREE.Face3(6,1,3),
		new THREE.Face3(6,3,2),
		new THREE.Face3(6,2,5),
		new THREE.Face3(6,5,4),
		new THREE.Face3(6,0,4),
		new THREE.Face3(6,1,0),
		new THREE.Face3(6,3,1),
		new THREE.Face3(6,2,3),
		new THREE.Face3(6,5,2),
		new THREE.Face3(6,4,5),

		new THREE.Face3(6,5,1),
		new THREE.Face3(6,4,5),
		new THREE.Face3(6,3,4),
		new THREE.Face3(6,2,3),
		new THREE.Face3(6,0,2),
		new THREE.Face3(6,1,0),
		new THREE.Face3(6,5,0),
		new THREE.Face3(6,3,5),
		new THREE.Face3(6,0,3),
		new THREE.Face3(6,2,4),
		new THREE.Face3(6,1,2),
		new THREE.Face3(6,4,1),

		new THREE.Face3(6,1,5),
		new THREE.Face3(6,5,4),
		new THREE.Face3(6,4,3),
		new THREE.Face3(6,3,2),
		new THREE.Face3(6,2,0),
		new THREE.Face3(6,0,1),
		new THREE.Face3(6,0,5),
		new THREE.Face3(6,5,3),
		new THREE.Face3(6,3,0),
		new THREE.Face3(6,4,2),
		new THREE.Face3(6,2,1),
		new THREE.Face3(6,1,4)
	];
	var c_core = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }) );
	scene.add(c_core);
	console.log( dots );

	let dotsBerge = [];
	dotsBerge.push( limitedLineFromTwoPointsFixed( pointA, pointB, null, new THREE.Vector3(0,aboveBerch.y,0) ) );
	dotsBerge.push( limitedLineFromTwoPointsFixed( null, pointB, pointC, new THREE.Vector3(0,aboveBerch.y,0) ) );
	dotsBerge.push( limitedLineFromTwoPointsFixed( pointA, null, pointC, new THREE.Vector3(0,0,aboveBerch.z) ) );
	dotsBerge.push( limitedLineFromTwoPointsFixed( null, pointB, pointC, new THREE.Vector3(0,0,aboveBerch.z) ) );
	dotsBerge.push( limitedLineFromTwoPointsFixed( pointA, pointB, null, new THREE.Vector3(aboveBerch.x,0,0) ) );
	dotsBerge.push( limitedLineFromTwoPointsFixed( pointA, null, pointC, new THREE.Vector3(aboveBerch.x,0,0) ) );
	/*dotsBerge.push( limitedLineFromTwoPoints( pointA, pointB, null, new THREE.Vector3(0,aboveBerch.y,0) ) );
	dotsBerge.push( limitedLineFromTwoPoints(  null, pointB, pointC, new THREE.Vector3(0,aboveBerch.y,0) ) );
	dotsBerge.push( limitedLineFromTwoPoints( pointA, null, pointC, new THREE.Vector3(0,0,aboveBerch.z) ) );
	dotsBerge.push( limitedLineFromTwoPoints(  null, pointB, pointC, new THREE.Vector3(0,0,aboveBerch.z) ) );
	dotsBerge.push( limitedLineFromTwoPoints( pointA, pointB, null,  new THREE.Vector3(aboveBerch.x,0,0) ) );
	dotsBerge.push( limitedLineFromTwoPoints( pointA, null,  pointC, new THREE.Vector3(aboveBerch.x,0,0) ) );*/

	let centerBerge = new THREE.Vector3(0,0,0);
	for( let i = 0; i < dotsBerge.length; i++ )
		centerBerge.add( dotsBerge[i] );
	centerBerge.divideScalar( dotsBerge.length );
	dotsBerge.push( centerBerge );

	geometry = new THREE.Geometry();
	geometry.vertices = dotsBerge;
	geometry.faces = [
		new THREE.Face3(6,4,0),
		new THREE.Face3(6,0,1),
		new THREE.Face3(6,1,3),
		new THREE.Face3(6,3,2),
		new THREE.Face3(6,2,5),
		new THREE.Face3(6,5,4),
		new THREE.Face3(6,0,4),
		new THREE.Face3(6,1,0),
		new THREE.Face3(6,3,1),
		new THREE.Face3(6,2,3),
		new THREE.Face3(6,5,2),
		new THREE.Face3(6,4,5),

		new THREE.Face3(6,5,1),
		new THREE.Face3(6,4,5),
		new THREE.Face3(6,3,4),
		new THREE.Face3(6,2,3),
		new THREE.Face3(6,0,2),
		new THREE.Face3(6,1,0),
		new THREE.Face3(6,5,0),
		new THREE.Face3(6,3,5),
		new THREE.Face3(6,0,3),
		new THREE.Face3(6,2,4),
		new THREE.Face3(6,1,2),
		new THREE.Face3(6,4,1),

		new THREE.Face3(6,1,5),
		new THREE.Face3(6,5,4),
		new THREE.Face3(6,4,3),
		new THREE.Face3(6,3,2),
		new THREE.Face3(6,2,0),
		new THREE.Face3(6,0,1),
		new THREE.Face3(6,0,5),
		new THREE.Face3(6,5,3),
		new THREE.Face3(6,3,0),
		new THREE.Face3(6,4,2),
		new THREE.Face3(6,2,1),
		new THREE.Face3(6,1,4)
	];

	var c_core_berch = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({ color: 0x0000ff }) );
	scene.add(c_core_berch);
	console.log( dotsBerge );

	/*let matrix = [
		[ 2, 3, -1],
		[ 1, -2, 1],
		[ 1, 0, 2],
	];
	let vec = [ 9, 3, 2 ];*/

	let matrixA = [
		[ 3, 5 ],
		[ 4, 1 ],
	];
	let matrixB = [
		[ -5, 1 ],
		[ 5, -8 ],
	];
	let matrixC = [
		[ 7, 3 ],
		[ 2, 4 ],
	];

	let vec = [ 0, 0, 1 ];
	let summa = [ 1, 1 ];

	func1( matrixA, summa, vec );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;

	container.appendChild( renderer.domElement );

	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame( animate );
	TWEEN.update();
	controls.update();
	render();
}
function render() {
	renderer.render( scene, camera );
}
function twoLines( point0, point1, point2, point3 ){
	let x = ( point0.x * point3.x + point1.x * point2.x ) / ( point0.x + point3.x - point1.x - point2.x );
	let y = ( point0.y * point3.y + point1.y * point2.y ) / ( point0.y + point3.y - point1.y - point2.y );
	let z = ( point0.z * point3.z + point1.z * point2.z ) / ( point0.z + point3.z - point1.z - point2.z );
}
function limitedLineFromTwoPoints( pointA, pointB, pointC, lim ){
	let x, y, z;
	let max = null;
	if( pointA == null ){
		if( lim.y != 0 && lim.y > Math.max( pointB.y, pointC.y ) )
			if( pointB.y > pointC.y )
				max = pointB.clone();
			else
				max = pointC.clone();

		if( lim.z != 0 && lim.z > Math.max( pointB.z, pointC.z ) )
			if( pointB.z > pointC.z )
				max = pointB.clone();
			else
				max = pointC.clone();

		point1 = pointB.clone();
		point2 = pointC.clone();
	}
	if( pointB == null ){
		if( lim.x != 0 && lim.x > Math.max( pointA.x, pointC.x ) )
			if( pointA.x > pointC.x )
				max = pointA.clone();
			else
				max = pointC.clone();

		if( lim.z != 0 && lim.z > Math.max( pointA.z, pointC.z ) )
			if( pointA.z > pointC.z )
				max = pointA.clone();
			else
				max = pointC.clone();

		point1 = pointA.clone();
		point2 = pointC.clone();
	}
	if( pointC == null ){
		if( lim.x != 0 && lim.x > Math.max( pointA.x, pointB.x ) )
			if( pointA.x > pointB.x )
				max = pointA.clone();
			else
				max = pointB.clone();

		if( lim.y != 0 && lim.y > Math.max( pointA.y, pointB.y ) )
			if( pointA.y > pointB.y )
				max = pointA.clone();
			else
				max = pointB.clone();

		point1 = pointA.clone();
		point2 = pointB.clone();
	}

	if( lim.x != 0 ){
		x = lim.x;
		y = ( x - point1.x ) * ( point2.y - point1.y ) / ( point2.x - point1.x ) + point1.y;
		z = ( x - point1.x ) * ( point2.z - point1.z ) / ( point2.x - point1.x ) + point1.z;
	}
	if( lim.y != 0 ){
		y = lim.y;
		x = ( y - point1.y ) * ( point2.x - point1.x ) / ( point2.y - point1.y ) + point1.x;
		z = ( y - point1.y ) * ( point2.z - point1.z ) / ( point2.y - point1.y ) + point1.z;

	}
	if( lim.z != 0 ){
		z = lim.z;
		y = ( z - point1.z ) * ( point2.y - point1.y ) / ( point2.z - point1.z ) + point1.y;
		x = ( z - point1.z ) * ( point2.x - point1.x ) / ( point2.z - point1.z ) + point1.x;
	}


	let point = new THREE.Vector3( x, y, z );
	if( max != null )
		point = max.clone();
	return point;
}
function limitedLineFromTwoPointsFixed( pointA, pointB, pointC, lim ){
	let x, y, z;
	let max = null;
	let flag = false;

	if( pointA == null ){
		if( lim.y != 0 && lim.y > Math.max( pointB.y, pointC.y ) )
			flag = true;

		if( lim.z != 0 && lim.z > Math.max( pointB.z, pointC.z ) )
			flag = true;

		point1 = pointB.clone();
		point2 = pointC.clone();
	}
	if( pointB == null ){
		if( lim.x != 0 && lim.x > Math.max( pointA.x, pointC.x ) )
			flag = true;

		if( lim.z != 0 && lim.z > Math.max( pointA.z, pointC.z ) )
			flag = true;

		point1 = pointA.clone();
		point2 = pointC.clone();
	}
	if( pointC == null ){
		if( lim.x != 0 && lim.x > Math.max( pointA.x, pointB.x ) )
			flag = true;

		if( lim.y != 0 && lim.y > Math.max( pointA.y, pointB.y ) )
			flag = true;

		point1 = pointA.clone();
		point2 = pointB.clone();
	}

	if( lim.x != 0 ){
		x = lim.x;
		y = ( x - point1.x ) * ( point2.y - point1.y ) / ( point2.x - point1.x ) + point1.y;
		z = ( x - point1.x ) * ( point2.z - point1.z ) / ( point2.x - point1.x ) + point1.z;
	}
	if( lim.y != 0 ){
		y = lim.y;
		x = ( y - point1.y ) * ( point2.x - point1.x ) / ( point2.y - point1.y ) + point1.x;
		z = ( y - point1.y ) * ( point2.z - point1.z ) / ( point2.y - point1.y ) + point1.z;
	}
	if( lim.z != 0 ){
		z = lim.z;
		y = ( z - point1.z ) * ( point2.y - point1.y ) / ( point2.z - point1.z ) + point1.y;
		x = ( z - point1.z ) * ( point2.x - point1.x ) / ( point2.z - point1.z ) + point1.x;
	}

	let point = new THREE.Vector3( x, y, z );
	if( max != null )
		point = max.clone();
	return point;
}
function intersectionOfThreePlanes( plane0, plane1, plane2, k0, k1, k2 ){
	let determinant = plane0.x * plane1.y * plane2.z
	 								+ plane0.y * plane1.z * plane2.x
	 							  + plane0.z * plane1.x * plane2.y
									- plane0.z * plane1.y * plane2.x
	 								- plane0.x * plane1.z * plane2.y
	 							  - plane0.y * plane1.x * plane2.z;
	let determinantX = k0 * plane1.y * plane2.z
									+ plane0.y * plane1.z * k2
									+ plane0.z * k1 * plane2.y
									- plane0.z * plane1.y * k2
									- k0 * plane1.z * plane2.y
									- plane0.y * k1 * plane2.z;
	let determinantY = plane0.x * k1 * plane2.z
									+ k0 * plane1.z * plane2.x
									+ plane0.z * plane1.x * k2
									- plane0.z * k1 * plane2.x
									- plane0.x * plane1.z * k2
									- k0 * plane1.x * plane2.z;
	let determinantZ = plane0.x * plane1.y * k2
									+ plane0.y * k1 * plane2.x
									+ plane0.z * plane1.x * plane2.y
									- plane0.z * plane1.y * plane2.x
									- plane0.x * k1 * plane2.y
									- plane0.y * plane1.x * k2;
	let point = new THREE.Vector3(
		determinantX / determinant,
		determinantY / determinant,
		determinantZ / determinant );
		console.log(point)
	return point;
}
function doGauss( matrix, vec ){
 let array = [];
 let result = [];
 let k = matrix[0].length;
 console.log(matrix)
 console.log(vec)

	for( let i = 0; i < matrix.length; i++ ){
		array.push([]);
		for( let j = 0; j < matrix[i].length; j++ )
			array[i].push( matrix[i][j] );
	}

 for( let i = 0; i < array.length; i++ )
 		array[i].push( vec[i] );

 for( let i = 0; i < array.length; i++ ){
	 let koef = 1 / array[i][i];
	 for( let j = i; j < array[i].length; j++ )
	 	array[i][j] *= koef;

	 for( let l = i + 1; l < array.length; l++ )
	 	for( let j = 0; j < array[l].length; j++ )
			 array[l][j] -= array[i][j];
	 }

 	 for( let i = array.length - 1; i > -1; i-- ){
		 let num = array[i][k];
		 for( let j = 0; j < result.length; j++ )
			 num -= result[j] * array[i][k - j - 1];

		 result.push( num );
	 }

	console.log(array)
	console.log(result)
}
function func1( matrix ){
	let array = [];
	let equal = [];

	for( let i = 1; i < matrix.length; i++ ){
		array.push([]);
		for( let j = 0; j < matrix[i].length; j++ ){
			let koef = matrix[i][j] - matrix[0][j];
			array[i - 1].push( koef );
		}
		equal.push( 0 );
	}
	array.push([]);
	for( let i = 0; i < matrix[0].length; i++ )
		array[array.length - 1].push( 1 );

	equal.push( 1 );
	console.log(array, equal)
	doGauss( array, equal );
}
function func2( matrix, sum ){

}
