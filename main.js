function start(container){
    Physijs.scripts.worker = 'physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';
    var container, scene, renderer, camera, light, ball, plane, box, geoBall, geoMat;
    var WIDTH, HEIGHT, VIEW_ANGLE, ASPECT, NEAR, FAR;
    var camera_ball_radius_x;
    var camera_ball_radius_z;
    var mousepos = 0;
    var clock = new THREE.Clock();
    var box_array = [];
    var renderGame = false;
    var spinVelocity = 0;
    box = {};
    init = function(){

        WIDTH = container.width(),
        HEIGHT = container.height();
        VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 1,
        FAR = 10000;

        scene = new Physijs.Scene();
        scene.setGravity(new THREE.Vector3( 0, -50, 0 ));
        scene.addEventListener('update', function() {
        scene.simulate(undefined, 2);
        });

        renderer = new THREE.WebGLRenderer({
        antialias: true
        });

        renderer.setSize(WIDTH, HEIGHT);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        renderer.shadowMapType = THREE.PCFShadowMap;
        renderer.shadowMapAutoUpdate = true;

        container[0].appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

        camera.position.set(60, 40, 120);
        camera.lookAt(scene.position);
        scene.add(camera);

        light = new THREE.DirectionalLight(0xffffff);

        light.position.set(0, 100, 60);
        light.castShadow = true;
        light.shadowCameraLeft = -200;
        light.shadowCameraTop = -60;
        light.shadowCameraRight = 200;
        light.shadowCameraBottom = 60;
        light.shadowCameraNear = 1;
        light.shadowCameraFar = 1000;
        light.shadowBias = -.0001
        light.shadowMapWidth = light.shadowMapHeight = 1024;
        light.shadowDarkness = .7;

        scene.add(light);

        var textureMap = THREE.ImageUtils.loadTexture("grass.jpg")
        textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
        textureMap.repeat.set(50, 50);

        plane = new Physijs.BoxMesh(
        new THREE.CubeGeometry(1000, 1000, 2, 10, 10),
        Physijs.createMaterial(
            new THREE.MeshBasicMaterial({
                map: textureMap
            }),
            .4,
            .8
        ),
        0
        );


        var geometry = new THREE.SphereGeometry(3000, 60, 40);
        var uniforms = {
              texture: { type: 't', value: THREE.ImageUtils.loadTexture('skybox.jpg') }
        };

        var material = new THREE.ShaderMaterial( {
              uniforms:       uniforms,
                vertexShader:   document.getElementById('sky-vertex').textContent,
                  fragmentShader: document.getElementById('sky-fragment').textContent
        });

        skyBox = new THREE.Mesh(geometry, material);
        skyBox.scale.set(-1, 1, 1);
        skyBox.eulerOrder = 'XZY';
        skyBox.renderDepth = 1000.0;
        scene.add(skyBox);

        plane.rotation.x = -Math.PI / 2;
        plane.rotation.y = -Math.PI ;
        plane.position.y = 5;
        plane.receiveShadow = true;

        scene.add(plane);
        plane2 = new Physijs.BoxMesh(
        new THREE.CubeGeometry(240, 10, 2, 10, 10),
        Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
            color: 'lightgrey'
            }),
            .4,
            .8
        ),
        0
        );

        plane2.rotation.x = -Math.PI / 2;
        plane2.rotation.y = -Math.PI ;
        plane2.position.y = 45;
        plane2.position.z = 50;
        plane2.position.x = -40;
        plane2.castShadow = true;
        plane2.receiveShadow = true;

        scene.add(plane2);

        ball = new Physijs.BoxMesh(
           geoBall,
            Physijs.createMaterial(
               geoMat,
                .4,
                .6
            ),
            0
        );
        ball.scale.set(0.05, 0.05, 0.05);
        ball.position.y = 40;
        ball.position.z = 50;
        ball.castShadow = true;
        ball.receiveShadow = true;

        camera_ball_radius_x = camera.position.x - ball.position.x;
        camera_ball_radius_z = camera.position.z - ball.position.z;

        scene.add(ball);
        var box_interval = -1;
        function ball_move(){
            ball.setLinearVelocity({x: ball.getLinearVelocity().x, y: 30, z: ball.getLinearVelocity().z});
            ball.setAngularVelocity({x: 0, y: 80, z: 0});
            spinVelocity = 70;
        }
        box = new Physijs.CylinderMesh(
            new THREE.CylinderGeometry(3, 3, 40, 20, 20),
            Physijs.createMaterial(
                new THREE.MeshLambertMaterial({
                color: 'lightgrey'
            }),
            .4,
            .8
            ),
            0
        );
        box.position.y = 25;
        box.position.x = -150;
        box.position.z = 50;
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);

        box2 = new Physijs.CylinderMesh(
            new THREE.CylinderGeometry(3, 3, 40, 20, 20),
            Physijs.createMaterial(
                new THREE.MeshLambertMaterial({
                color: 'lightgrey'
            }),
            .4,
            .8
            ),
            0
        );
        box2.position.y = 25;
        box2.position.x = 70;
        box2.position.z = 50;
        box2.castShadow = true;
        box2.receiveShadow = true;
        scene.add(box2);
        function startGame(){
            box_interval = setInterval(function(){
            }, 1000);
                    



            container[0].addEventListener('mousedown', ball_move, false);
        }
        gameBegin = $('<div>Start Game</div>');
        gameBegin.css({
            position: 'absolute',
            background: 'green',
            color: 'white',
            padding: '5px',
            left: WIDTH/2 - gameBegin.width()/2,
            top: HEIGHT/2 - gameBegin.height()/2
        });
        container.append(gameBegin)
        var scoreCount = 0;
        var counter = $('<div>');
        counter.css({
            position: 'absolute',
            top: 10,
            right: 10,
            padding: 10,
            background: 'white',
            border: '1px solid black',
            color: 'black'
        });
        counter.text(scoreCount);
        container.append(counter);
        var lastPillar ={position: {x: 0}}
        container.on('click.begin', function(){
            scene.remove(ball);
            ball = new Physijs.BoxMesh(
            geoBall,
                Physijs.createMaterial(
                geoMat,
                    .4,
                    .6
                ),
                1
            );
            ball.scale.set(0.05, 0.05, 0.05);
            ball.position.y = 40;
            ball.position.z = 50;
            ball.castShadow = true;
            ball.receiveShadow = true;
            container.off('click.begin');
            scene.add(ball);
            function collision() {
                renderGame = false;
                clearInterval(box_interval);
                gameEnd = $('<div>Game Over<br />Click Me To Restart</div>');
                gameEnd.css({
                    position: 'absolute',
                    background: 'red',
                    color: 'white',
                    padding: '5px',
                    left: WIDTH/2 - gameEnd.width()/2,
                    top: HEIGHT/4 - gameEnd.height() * 8
                });
                container.append(gameEnd);
                ball.removeEventListener('collision', collision);
                //container[0].removeEventListener('mousedown', ball_move);
                gameEnd.on('click.end', function(){
                    lastPillar ={position: {x: 0}}
                    for(b in box_array){
                        scene.remove(box_array[b]);
                    }
                    box_array = [];
                    scene.remove(ball);
                    ball = new Physijs.BoxMesh(
                    geoBall,
                        Physijs.createMaterial(
                        geoMat,
                            .4,
                            .6
                        ),
                        1
                    );
                    ball.scale.set(0.05, 0.05, 0.05);
                    ball.position.y = 40;
                    ball.position.z = 50;
                    ball.castShadow = true;
                    ball.receiveShadow = true;
                    scene.add(ball);
                    ball.addEventListener('collision', collision, false);
                    container.off('click.end');
                    gameEnd.remove();
                    renderGame = true;
                    scoreCount = 0;
                    counter.text(scoreCount);
                    startGame();
                });
            }
            ball.addEventListener('collision', collision, false);
            gameBegin.remove();
            renderGame = true;
            startGame();
        });
        
        renderer.setClearColor(0xffffff, 1);
        render();
        scene.simulate()


        var next = Date.now();


        function render() {
            if (renderGame) {
                var now = Date.now();
                if(lastPillar.position.x < 35){ 
                    var box_bottom_size = Math.round((Math.random() * 10) + 05);
                    var box_top_size = 22 - box_bottom_size;
                    var gap = 28;


                    box_bottom = new Physijs.CylinderMesh(
                        new THREE.CylinderGeometry(3, 3, box_bottom_size, 20, 20),
                        Physijs.createMaterial(
                            new THREE.MeshLambertMaterial({
                                color: 'lightgrey'
                            }),
                            .4,
                            .8
                        ),
                        0
                    );

                    box_bottom.position.y = box_bottom_size - 1;
                    box_bottom.position.x = 70;
                    box_bottom.position.z = 50;
                    box_bottom.castShadow = true;
                    box_bottom.receiveShadow = true;
                    box_bottom.is_count_box = true;
                    box_bottom.not_counted = true;
                    scene.add(box_bottom);

                    box_top = new Physijs.CylinderMesh(
                        new THREE.CylinderGeometry(3, 3, box_top_size, 20, 20),
                        Physijs.createMaterial(
                            new THREE.MeshLambertMaterial({
                                color: 'lightgrey'
                            }),
                            .4,
                            .8
                        ),
                        0
                    );

                    box_top.position.y = 45 - box_top_size/2; //box_top_size + gap;
                    box_top.position.x = 70;
                    box_top.position.z = 50;
                    box_top.castShadow = true;
                    box_top.receiveShadow = true;
                    box_top.is_count_box = false;
                    scene.add(box_top);
                    box_array.push(box_bottom);
                    box_array.push(box_top);
                    lastPillar = box_bottom;
                }
                for (var i = 5; i < scene.children.length - 5; i++) {
                    var obj = scene.children[i];

                    if (obj.position.y <= -50) {
                        scene.remove(obj);
                    }
                }
                

                box.__dirtyPosition = true;
                if( now - next > 10){
                    var remover = [];
                    for(b in box_array){
                        box_array[b].position.x += -0.5
                        box_array[b].__dirtyPosition = true;
                        if(box_array[b].position.x <= -150){
                            scene.remove(box_array[b]);
                            remover.push(b);
                        }
                        if(box_array[b].position.x < ball.position.x && box_array[b].is_count_box && box_array[b].not_counted){
                            scoreCount++;
                            counter.text(scoreCount);
                            box_array[b].not_counted = false;
                        }
                    }
                    remover.sort(function(a, b){
                        if(a > b) return -1;
                        if(a < b) return 1;
                        return 0;
                    });
                    for(r in remover){
                        box_array.splice(remover[r], 1);
                    }
                    next = now;
                }
            }
            try{
                if(spinVelocity > 0) {
                    spinVelocity *= 0.97;
                    ball.setAngularVelocity({x: 0, y: spinVelocity , z: 0});
                }
            } catch (e) {}
            var pos = (Math.PI/WIDTH*(mousepos)) - (Math.PI/2);
            camera.position.x = ball.position.x + (1.5 * camera_ball_radius_x) * Math.sin(pos);
            camera.position.z = ball.position.z + (1.5 * camera_ball_radius_z) * Math.cos(pos);
            camera.lookAt(ball.position);

            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }
        container.on('mousemove', function(e){
            mousepos = e.clientX;
        });
    }
    var manager = new THREE.LoadingManager();
    var loader = new THREE.JSONLoader( manager );
    loader.load('Ornithopter.js', function( object, obj_mat ){
        geoBall = object;
        geoMat = new THREE.MeshLambertMaterial({ color: 0xd6933d });
        init();
    });
}


