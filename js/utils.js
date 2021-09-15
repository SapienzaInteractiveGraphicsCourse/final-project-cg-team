var width = window.innerWidth;
var height = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
var scene = new THREE.Scene;
var camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
var textLoader = new THREE.TextureLoader();
var loader = new THREE.GLTFLoader();
var clock;
var context;
