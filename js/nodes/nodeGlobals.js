/********************************/
/************Colors**************/
/********************************/
var basicNodeColor  		  = "#FFFC99";
var basicTitleColor 		  = "#000000";
var basicSelectedTitleColor   = "#000000";
var spawnNodeColor            = "#8385C3";
var initNodeColor             = "#87C09F";
var forcesNodeColor           = "#FF7070";
var conditionsNodeColor       = "#FFAB5C";
var modifyPropertiesNodeColor = "#DE85FF";
var collisionsNodeColor       = "#A3B082";

/********************************/
/************Vectors*************/
/********************************/
var vector_2 = new Float32Array(2);
var vector_3 = new Float32Array(3);
var vector_4 = new Float32Array(4);
var default_particle_color = [1,1,1,1];

/********************************/
/*************Lists**************/
/********************************/
//var meshes_list  = [];
var forces_list  = [];
var system_list  = [];
var objects_list = [];

/********************************/
/***********Mesh Stuff***********/
/********************************/
var default_centers    = [0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0];
var default_coords     = [1,1, 0,1, 1,0, 0,0, 1,0, 0,1];
var square_vertices    = [0.5,0.5, -0.5,0.5, 0.5,-0.5, -0.5,-0.5, 0.5,-0.5, -0.5,0.5];//[0.5,0.5, -0.5,0.5, 0.5,0, -0.5,0., 0.5,0., -0.5,0.5];
var default_color      = [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1];
var default_sizes      = [0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25];
var default_visibility = [0, 0, 0, 0, 0, 0];
var default_forces_mesh;


/********************************/
/*************Modals*************/
/********************************/
var texture_modal = $('#texturesModal');
var def_texture_1 = document.getElementById("def_texture1");
var def_texture_2 = document.getElementById("def_texture2");
var def_texture_3 = document.getElementById("def_texture3");
var def_texture_4 = document.getElementById("def_texture4");
var def_texture_5 = document.getElementById("def_texture5");
var local_texture = document.getElementById("texture_local");


/********************************/
/*************Meshes*************/
/********************************/
var mesh_modal  = $('#meshesModal');
var def_mesh_1  = document.getElementById("def_mesh1");
var def_mesh_2  = document.getElementById("def_mesh2");
var def_mesh_3  = document.getElementById("def_mesh3");
var def_mesh_4  = document.getElementById("def_mesh4");
var def_mesh_5  = document.getElementById("def_mesh5");
var def_mesh_6  = document.getElementById("def_mesh6");
var def_mesh_7  = document.getElementById("def_mesh7");
var def_mesh_8  = document.getElementById("def_mesh8");
var def_mesh_9  = document.getElementById("def_mesh9");
var url_mesh    = document.getElementById("mesh_url");
var custom_mesh = document.getElementById("mesh_custom");

function lerpVec(s, e, x){
	var out = [];

	if(s.length != e.length)
		return;

	for(var i = 0; i < s.length; ++i)
		out.push(s[i] * ( 1 - x ) + e[i] * x);

	return out; 
}

function lerp(s, e, x){
	return s * ( 1 - x ) + e * x;
}


/*
* 	This method returns the cross product of two vectors
*	@method cross
*	@params {vector3} the first vector
*	@params {vector3} the second vector
*/
function cross(a, b){
    var c = new Float32Array(3);
    
    c[0] = a[1]*b[2] - a[2]*b[1];
    c[1] = a[2]*b[0] - a[0]*b[2];
    c[2] = a[0]*b[1] - a[1]*b[0];

    return c;
}


/*
* 	This method returns the multiplication of two vectors
*	@method mult
*	@params {vector3} the first vector
*	@params {vector3} the second vector
*/
function mult(a, b){
	var c = new Float32Array(3);
	
	c[0] = a[0] * b[0];
	c[1] = a[1] * b[1];
	c[2] = a[2] * b[2];

	return c;
}


/*
* 	This method is for search a force in the force list
*	@method searchForce
*	@params {Number}  the id of the force
*	@params {Boolean} if is true the force will be deleted
*/
function searchForce(id, remove = false)
{
	for(x in forces_list){
	   	if (forces_list[x].id == id){
			if(!remove)
	        	return forces_list[x];
	        forces_list.splice(x, 1);
	   	}
    }
}


/*
* 	This method is for add a force to the force list
*	@method addForce
*	@params {Number}  the id of the force
*	@params {position} the position of the force
*	@params {type} the type of the force
*/
function addForce(id, position, type){
	var model = mat4.create();
	mat4.setTranslation(model, position);

	var force = {
			id    : id,
			type  : type,
			model : model,
			position : position,
			color : [1,1,1,1],
			visible : true
		};

	forces_list.push( force );

	return force;
}


/*
* 	This method is for search a object in the objects list
*	@method searchObject
*	@params {Number}  the id of the object
*	@params {Boolean} if is true the mesh will be deleted
*/
function searchObject(id, remove = false)
{
    for(x in objects_list){
		if (objects_list[x].id == id){
			if(!remove)
				return objects_list[x];
			objects_list.splice(x, 1);
		}
	}
}


/*
* 	This method is for search a mesh in the meshes list
*	@method searchMesh
*	@params {Number}  the id of the mesh
*	@params {Boolean} if is true the mesh will be deleted
*/
function searchMesh(id, remove = false)
{
    for(x in meshes_list){
		if (meshes_list[x].id == id){
			if(!remove)
				return meshes_list[x].mesh;
			meshes_list.splice(x, 1);
		}
	}
}


/*
* 	This method is for search a system in the system list
*	@method searchSystem
*	@params {Number}  the id of the system
*	@params {Boolean} if is true the system will be deleted
*/
function searchSystem(id, remove = false)
{
	for(x in system_list){
	   	if (system_list[x].id == id){
			if(!remove)
	        	return system_list[x];
	        system_list.splice(x, 1);
	   	}
    }
}


/*
* 	This class is for save information about every system
*	@class SystemInfo
*/
class SystemInfo {
	constructor(id_, position_, max_particles_) {
		this.id                 = id_;
		this.mesh_id            = id_;
		this.distance_to_camera = 0;

		this.total_particles    = 0;
		this.position           = position_;
		this.model              = mat4.create();
		this.point_mode         = true;
		this.external_model     = undefined;
		this.color              = [1,1,1,1];
		this.visible            = true;
		this.visibility         = 1;
		this.coords             = default_coords;

		this.src_bfact          = gl.SRC_ALPHA;
		this.dst_bfact          = gl.ONE;

		//Textures
		this.texture            = {file: undefined, id: undefined};
		this.texture_change     = false;
		this.atlas              = undefined;
		this.uvs 				= [];

		//Spawn Info
		this.spawn_rate			= 0;
		this.spawn_mode			= "Linear";
		this.particles_per_wave = 0;
		this.origin 			= "Point";
		this.origin_mesh        = undefined;

		//Ids list
		this.particles_ids      = [];	

		//Reset list
		this.particles_to_reset = [];
	
		//Max elements
		this.max_particles      = max_particles_;
		this.sub_emission_part  = 0;
		this.max_subemissions   = 0;
		this.sub_emittors       = [];

		this.particles_list     = [];
		this.particles_mesh     = createMesh(max_particles_);
		this.line_mesh  	    = createLineMesh(max_particles_);
	}
}

/*
* 	This class is for save information about every system
*	@class SystemInfo
*/
class SubEmitterInfo {
	constructor(id_, max_particles_, spawn_rate_, particles_per_wave_) {
		this.id = id_;

		//Spawn Info
		this.spawn_rate			= spawn_rate_;
		this.spawn_mode			= "Waves";
		this.particles_per_wave = particles_per_wave_;
		this.origin 			= "Point";
		this.texture            = {file: undefined, id: undefined};

		this.ids      = []; //Ids list	
		this.to_reset = []; //Reset list
	
		this.max_particles = max_particles_; //Max elements
	}
}

function randomNumber(min, max){
  return Math.random() * (max - min) + min;
}

/*
* 	This class is for save information about every particle
*	@class SystemInfo
*/
class Particle {
	constructor() {
		this.size = 0.25;
	}
}

Particle.prototype.fill = function(properties, is_Trail = false) {
	var speed = new Float32Array(3);
	speed[0]  = randomNumber(properties.min_speed[0], properties.max_speed[0]);
	speed[1]  = randomNumber(properties.min_speed[1], properties.max_speed[1]);
	speed[2]  = randomNumber(properties.min_speed[2], properties.max_speed[2]);

	//Radom definition of the lifetime
	lifetime = randomNumber(properties.min_life_time, properties.max_life_time);

	this.position = [0,0,0];
	for (var i = 0; i < 3; ++i)
		this.position[i] = properties.position[i];

	this.color  = [0,0,0,0];
	this.iColor = [0,0,0,0];
	for (var i = 0; i < 4; ++i)
	{
		this.iColor[i] = properties.color[i];
		this.color[i]  = properties.color[i];
	}
	
	this.coords = properties.coords;

	var s = randomNumber(properties.min_size, properties.max_size);
	this.size  = s;
	this.iSize = s;
	
	this.speed  = speed;
	this.aSpeed = [0,0,0];
	this.iSpeed = [0,0,0];

	for (var i = 0; i < 3; ++i)
		this.iSpeed[i] = speed[i];

	this.lifetime   = lifetime;
	this.c_lifetime = 0.0; //How many life time the particle lived
	this.visibility = 1;

	this.animated  = false;
	this.frameRate = 0;
	this.c_frame   = 0;
	this.frameX    = 0;  
	this.frameY    = 0;  

	/************************/
	/********CONDITION*******/
	/************************/
	this.conditions_meet = [];

	/************************/
	/*********TRAILS*********/
	/************************/
	if(!is_Trail)
	{
		this.num_trails = 0;
		this.trails = [];
		//In this array I will save the last 2 positions of the particle 
		//var p = this.position.slice(0);
		//this.old_positions.unshift(p);
		//this.old_positions.unshift(p);
	}
	else
		this.parent_particle = properties.origin_id; 

	var texture = properties.texture; 
	
	if(texture.file == undefined)
		return;

	if(texture.prop.animated)
	{
		this.animated = true;

		var t = lifetime;
		var t_prop = texture.prop;

		if(texture.prop.anim_loop)
		{
			var anim_d = t_prop.anim_duration;
			t = anim_d == 0 ? lifetime : anim_d;
		}

		var frame_number = Math.floor(t_prop.textures_x + t_prop.textures_y) - 1; 
		this.frameRate = (t / frame_number);
	}

};


/*
* 	This method is for create a mesh
*	@method createMesh
*	@params {Number} the id of the mesh
*	@params {Number} the maximum number of particles
*/
function createMesh(particles){
	var vertices = new Float32Array(particles * 6 * 3); //Save information about the center of the particle
	var coords   = new Float32Array(particles * 6 * 2); //The "possible changed" coordinates of the particle
	var icoord   = new Float32Array(particles * 6 * 2); //The original coordinates of the particle
	var sizes    = new Float32Array(particles * 6 * 2); //
	var colors   = new Float32Array(particles * 6 * 4); //
	var visible  = new Float32Array(particles * 6);     //This array is for know with particles are not visible

	for(var i = 0; i < particles; i ++)
	{
		visible.set(default_visibility, i*6);
		vertices.set(default_centers,   i*6*3);
		coords.set(default_coords,      i*6*2);
		icoord.set(square_vertices,     i*6*2);
		colors.set(default_color,       i*6*4);
		sizes.set(default_sizes,        i*6*2);
	}

	var mesh = new GL.Mesh();
	mesh.addBuffers({ 
					  vertices : vertices, 
					  coords   : coords, 
					  icoord   : icoord,
		              colors   : colors, 
		              visible  : visible,
		              size     : sizes
		            }, null, gl.STREAM_DRAW);

	return mesh;
}

/*
* 	This method is for create a mesh
*	@method createMesh
*	@params {Number} the id of the mesh
*	@params {Number} the maximum number of particles
*/
function createLineMesh(particles){
	var vertices = new Float32Array(particles * 2 * 3); //Save information about the center of the particle
	var visible  = new Float32Array(particles * 2 * 3); //Save information about the center of the particle

	for(var i = 0; i < particles; i ++)
		visible.set(default_visibility, i*6);

	var mesh = new GL.Mesh();
	mesh.addBuffers({vertices : vertices, visible : visible}, null, gl.STREAM_DRAW);

	return mesh;
}

SystemInfo.prototype.orderBuffers = function(particles){
	var all_ids  = this.all_ids;
	var mesh     = this.particles_mesh;
	var lineMesh = this.line_mesh;

	var length  = all_ids.length;

	//If there are no particles then retun
	if(length == 0)
		return;

	var particle, id;

	var vertex_data      = mesh.getBuffer("vertices").data;
	var visibility_data  = mesh.getBuffer("visible").data;
	var color_data       = mesh.getBuffer("colors").data;
	var size_data        = mesh.getBuffer("size").data;
	var coord_data       = mesh.getBuffer("coords").data;

	var line_vertex_data  = lineMesh.getBuffer("vertices").data;
	var line_visible_data = lineMesh.getBuffer("visible").data;
	var pos = 0;

	for (var i = 0; i < length; ++i)
	{
		id = all_ids[i].id;
		particle = particles[id];

		for(var j = 0; j < 18; ++j)
			vertex_data[i*18 + j] = particle.position[j % 3];

		for(var j = 0; j < 12; ++j){
			coord_data[i*12 + j] = particle.coords[j];
			size_data[i*12 + j]  = particle.size;
		}

		for(var j = 0; j < 6; ++j)
			visibility_data[i*6 + j] = particle.visibility;
		
		for(var j = 0; j < 24; ++j)
			color_data[i*24 + j] = particle.color[j % 4];

		if(switchLines.checked)
		{
			line_vertex_data[pos]   = particle.position[0];
			line_vertex_data[pos+1] = particle.position[1] 
			+ (particle.position[1] < 0 ? (particle.size*0.5) : -(particle.size*0.5)) 
			+ (this.origin == "Point" ? this.position[1] : 0); 
			line_vertex_data[pos+2] = particle.position[2];

			line_vertex_data[pos+3] = particle.position[0];
			line_vertex_data[pos+4] = 0;
			line_vertex_data[pos+5] = particle.position[2];

			for(var j = 0; j < 6; ++j)
				line_visible_data[pos+j] = particle.visibility;

			pos += 6;
		}
	}

	mesh.upload();

	if(switchLines.checked)
		lineMesh.upload();
}

/*
* 	This method is for change the maximum number of particles of a system
*	@method createMesh
*	@params {Mesh} the mesh
*	@params {Number} the new maximum 
*/
SystemInfo.prototype.resizeBufferArray = function(particles){
	var mesh      = this.particles_mesh;
	var line_mesh = this.line_mesh; 
	var newSize   = this.total_particles;

	var data_Vertex  = mesh.getBuffer("vertices").data;
	var data_Visible = mesh.getBuffer("visible").data;
	var data_Coords  = mesh.getBuffer("coords").data;
	var data_iCoords = mesh.getBuffer("icoord").data;
	var data_Colors  = mesh.getBuffer("colors").data;
	var data_Size    = mesh.getBuffer("size").data;

	var data_linesVertex  = line_mesh.getBuffer("vertices").data;
	var data_linesVisible = line_mesh.getBuffer("visible").data;

	var vertexSize  = newSize * 6 * 3;
	var coordsSize  = newSize * 6 * 2;
	var colorsSize  = newSize * 6 * 4;
	var visibleSize = newSize * 6;

	var vertexLineSize = newSize * 2 * 3;

	var size, data, data_size, default_data;

	if (vertexSize == data_Vertex.length)
		return;

	var vertexBuffers = mesh.vertexBuffers;

    if (vertexSize < data_Vertex.length){

        mesh.getBuffer("vertices").data = data_Vertex.slice(0, vertexSize);
        mesh.getBuffer("visible").data  = data_Visible.slice(0, visibleSize);
        mesh.getBuffer("colors").data   = data_Colors.slice( 0, colorsSize);
        mesh.getBuffer("coords").data   = data_Coords.slice(0, coordsSize);
        mesh.getBuffer("icoord").data   = data_iCoords.slice(0, coordsSize);
        mesh.getBuffer("size").data     = data_Size.slice(0, coordsSize);

        line_mesh.getBuffer("vertices").data = data_linesVertex.slice(0, vertexLineSize);
        line_mesh.getBuffer("visible").data   = data_linesVisible.slice(0, visibleSize);

        this.orderBuffers(particles);
    } else {

    	for (x in mesh.vertexBuffers) { 
    		if (x == "vertices") {
    			size = vertexSize;
    			data_size = 6 * 3;
    			data = data_Vertex;
    			default_data = default_centers;
    		}
    		else if (x == "coords") {
    			size = coordsSize;   
    			data_size = 6 * 2;
    			data = data_Coords; 	
    			default_data = default_coords;	
    		}
    		else if (x == "colors") {
    			size = colorsSize;
    			data_size = 6 * 4;
    			data = data_Colors;
    			default_data = default_color;
    		}
    		else if (x == "visible") {
    			size = visibleSize;
    			data_size = 6;
    			data = data_Visible;
    			default_data = [0.0];
    		}
			else if (x == "size") {
    			size = coordsSize;   
    			data_size = 6 * 2;
    			data = data_Size; 	
    			default_data = default_sizes;	
    		}
    		else if (x == "icoord") {
    			size = coordsSize;   
    			data_size = 6 * 2;
    			data = data_iCoords; 	
    			default_data = square_vertices;	
    		}

        	var nBuff = new Float32Array(size);

        	//Copying the old data
	        for (var i = 0; i < data.length; i++)
	            nBuff[i] = data[i];
	        
	        //Filling the new information in the buffers
			for(var i = data.length / data_size; i < nBuff.length / data_size; i ++)
			    nBuff.set(default_data, i*data_size);

	        mesh.getBuffer(x).data = nBuff
    	}

    	for (x in line_mesh.vertexBuffers) {
			if (x == "vertices") {
    			size = vertexLineSize;
    			data_size = 2 * 3;
    			data = data_linesVertex;
    			default_data = [0,0,0, 0,0,0];
    		}
    		else if (x == "visible") {
    			size = visibleSize;
    			data_size = 6;
    			data = data_linesVisible;
    			default_data = [0.0];
    		}

			var nBuff = new Float32Array(size);

        	//Copying the old data
	        for (var i = 0; i < data.length; i++)
	            nBuff[i] = data[i];
	        
	        //Filling the new information in the buffers
			for(var i = data.length / data_size; i < nBuff.length / data_size; i ++)
			    nBuff.set(default_data, i*data_size);

	        line_mesh.getBuffer(x).data = nBuff
    	}
	}	
}


/*
* 	This method is for update the position of a particles
*	@method updateVertex
*	@params {Mesh} the mesh
*	@params {Number} the id of the particle
*	@params {Number} the particle
*/
function updateVertexs(mesh, particle_id, particle){
	var vertex_data = mesh.vertexBuffers.vertices.data;

	particle_id *= 18
	var j = 0;

	for(var i = 0; i < 18; i++)
	{
		vertex_data[particle_id + i] = particle.position[j]
		j = (j + 1) % 3;
	}

} 


/*
* 	This method is for update the visibility of a particle
*	@method updateVisibility
*	@params {Mesh} the mesh
*	@params {particle} the particle
*	@params {Number} the id of the particle
*	@params {Number} enable or disable the visibility
*/
function updateVisibility(mesh, particle, particle_id, visible = 0.0){
	var visibility_data = mesh.vertexBuffers.visible.data;
	particle_id *= 6
	particle.to_reset = false;

	for(var i = 0; i < 6; i++)
		visibility_data[particle_id + i] = visible;		
} 


/*
* 	This method is for update the color of a particle
*	@method updateColor
*	@params {Mesh} the mesh
*	@params {particle} the particle
*	@params {Number} the id of the particle
*/
function updateColor(mesh, particle, particle_id){
	var color_data = mesh.vertexBuffers.colors.data;
	particle_id *= 24

	var j = 0;

	for(var i = 0; i < 24; i++)
	{
		color_data[particle_id + i] = particle.color[j];		
		j = (j + 1) % 4;
	}
} 


/*
* 	This method is for update the size of a particle
*	@method updateSize
*	@params {Mesh} the mesh
*	@params {particle} the particle
*	@params {Number} the id of the particle
*/
function updateSize(mesh, particle, particle_id){
	var size_data = mesh.vertexBuffers.size.data;
	particle_id *= 12

	//var j = 0;

	for(var i = 0; i < 12; i++)
	{
		size_data[particle_id + i] = particle.size;		
	//	j = (j + 1) % 2;
	}
} 


function updateCoord(mesh, particle, particle_id, new_coord){
	var coord_data = mesh.vertexBuffers.coords.data;
	var lowX  = new_coord[0];
	var lowY = new_coord[1];
	var highX  = new_coord[2];
	var highY = new_coord[3];
	
	particle_id *= 12

	coord_data[particle_id]   = highX;
	coord_data[particle_id+1] = highY;

	coord_data[particle_id+2] = lowX;
	coord_data[particle_id+3] = highY;

	coord_data[particle_id+4] = highX;
	coord_data[particle_id+5] = lowY;

	coord_data[particle_id+6] = lowX;
	coord_data[particle_id+7] = lowY;

	coord_data[particle_id+8] = highX;
	coord_data[particle_id+9] = lowY;

	coord_data[particle_id+10] = lowX;
	coord_data[particle_id+11] = highY;

} 


function onShowNodePanel(node){
	window.SELECTED_NODE = node;
    var panel = document.querySelector("#node-panel");
    if(panel)
        panel.close();
    var ref_window = this.graphCanvas.getCanvasWindow();
    panel = this.graphCanvas.createPanel(node.title || "",{closable: true, window: ref_window });
    panel.id = "node-panel";
    panel.node = node;
    panel.classList.add("dialog");
    var that = this.graphCanvas;
    var graphcanvas = this.graphCanvas;

    var aux_panel = this.graphCanvas.createPanel(node.title || "",{closable: true, window: ref_window });

    function inner_refresh()
    {
        panel.content.innerHTML = ""; //clear
       	
        if(Object.keys(node.properties).length == 0)
        	panel.addHTML("<span class='node_desc'> (" + node.type + ") <br>" + (node.constructor.desc || ""));
        else 
        {
	  		panel.addHTML("<span class='node_desc'> (" + node.type + ") <br>" + (node.constructor.desc || "")
	        			  +"</span><span class='separator'></span>");
	        /*panel.addHTML("<span class='node_type'>"+node.type
	        			  +"</span><span class='node_desc'>"+(node.constructor.desc || "")
	        			  +"</span><span class='separator'></span>");*/

	        panel.addHTML("<h3>Properties</h3>");
	        panel.addHTML("", "node_properties");

	        for(var i in node.properties)
	        {
	            var value = node.properties[i];
	            var info = node.getPropertyInfo(i);
	            var type = info.type || "string";

	            //in case the user wants control over the side panel widget
	            if( node.onAddPropertyToPanel && node.onAddPropertyToPanel(i,panel) )
	                continue;

	            var elem = aux_panel.addWidget( info.widget || info.type, i, value, info, function(name,value){
			                graphcanvas.graph.beforeChange(node);
			                node.setProperty(name,value);
			                graphcanvas.graph.afterChange();
			                graphcanvas.dirty_canvas = true;
			            });

	            if( node.prop_desc != undefined )
	            	if ( node.prop_desc[i] != undefined ) 
	           			elem.innerHTML += '<div class="tooltiptext">'+ node.prop_desc[i]+'</div>';
	            
	            panel.children[1].children[2].innerHTML += elem.outerHTML;
	        }
        }

        if(node.onShowCustomPanelInfo)
            node.onShowCustomPanelInfo(panel);

        panel.addButton("Delete",function(){
            if(node.block_delete)
                return;
            node.graph.remove(node);
            panel.close();
        }).classList.add("delete");
    }

    function inner_showCodePad( node, propname )
    {
        panel.style.top = "calc( 50% - 250px)";
        panel.style.left = "calc( 50% - 400px)";
        panel.style.width = "900px";
        panel.style.height = "500px";

        if(window.CodeFlask) //disabled for now
        {
            panel.content.innerHTML = "<div class='code'></div>";
            var flask = new CodeFlask( "div.code", { language: 'js' });
            flask.updateCode(node.properties[propname]);
            flask.onUpdate( function(code) {
                node.setProperty(propname, code);
            });
        }
        else
        {
            panel.content.innerHTML = "<textarea class='code'></textarea>";
            var textarea = panel.content.querySelector("textarea");
            textarea.value = node.properties[propname];
            textarea.addEventListener("keydown", function(e){
                //console.log(e);
                if(e.code == "Enter" && e.ctrlKey )
                {
                    console.log("Assigned");
                    node.setProperty(propname, textarea.value);
                }
            });
            textarea.style.height = "calc(100% - 40px)";
        }
        var assign = that.createButton( "Assign", null, function(){
            node.setProperty(propname, textarea.value);
        });
        panel.content.appendChild(assign);
        var button = that.createButton( "Close", null, function(){
            panel.style.height = "";
            inner_refresh();
        });
        button.style.float = "right";
        panel.content.appendChild(button);
    }

    inner_refresh();

    document.getElementById("nodeDisplay").appendChild( panel );
}

function chargeTexture(node, node_properties, url, def_text = "NONE"){
	texture_modal.modal('hide');

	GL.Texture.fromURL(url, {}, function(t,u){node.afterLoading(t,u)});
	node_properties.default_texture = def_text;
}

function loadTexture(node){
	
	texture_modal.modal('show');
	var node_properties = node.properties;

	def_texture_1.onclick = function(){
		chargeTexture(node, node_properties, 'default_textures/particles/smoke.png', 'smoke');
	}

	def_texture_2.onclick = function(){
		chargeTexture(node, node_properties, 'default_textures/particles/smoke2.png', 'smoke2');
	}
	
	def_texture_3.onclick = function(){
		chargeTexture(node, node_properties, 'default_textures/particles/fire.png', 'fire');
	}
	
	def_texture_4.onclick = function(){
		chargeTexture(node, node_properties, 'default_textures/particles/light.png', 'light');
	}

	def_texture_5.onclick = function(){
		chargeTexture(node, node_properties, 'default_textures/particles/AnimatedExplosion.png', 'AnimatedExplosion');
	}

	local_texture.onclick = function(){
		var input = document.createElement("input");
		input.type = "file";

		input.addEventListener("change", function(e){
			var file = e.target.files[0];
			
			if (!file || file.type.split("/")[0] != "image")
			{
				createAlert("Holy Guacamole!", "Loading error", "Please insert an image...", "danger", true, true, "pageMessages");
			    return;	
			}
		
			var reader = new FileReader();
			reader.onload = function(e) {
				chargeTexture(node, node_properties, reader.result);
			};

			reader.readAsDataURL(file);

		}, false);

		input.click();
	}
}

//https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function chargeMesh(node, url){
	GL.Mesh.fromURL(url, node.onMeshLoaded.bind(node));
	mesh_modal.modal('hide');
}

function loadMesh(node){
	
	mesh_modal.modal('show');

	//Pango
	def_mesh_1.onclick = function(){
		chargeMesh(node, 'default_meshes/pango.obj');
		node.properties.name = "pango";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
	}

	//Cylinder
	def_mesh_2.onclick = function(){
		node.onMeshLoaded(GL.Mesh.cylinder({radius:0.5}));
		node.properties.name = "cylinder";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
		mesh_modal.modal('hide');
	}
	
	//Plane
	def_mesh_3.onclick = function(){
		node.onMeshLoaded(GL.Mesh.plane(), true);
		node.properties.name = "plane";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
		mesh_modal.modal('hide');
	}
	
	//Dodo
	def_mesh_4.onclick = function(){
		chargeMesh(node, 'default_meshes/dodo.obj');
		node.properties.name = "dodo";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
	}

	//Cube
	def_mesh_5.onclick = function(){
		node.onMeshLoaded(GL.Mesh.cube());
		node.properties.name = "cube";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
		mesh_modal.modal('hide');
	}

	//Cone
	def_mesh_6.onclick = function(){
		node.onMeshLoaded(GL.Mesh.cone({radius:0.5,height:1}));
		node.properties.name = "cone";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
		mesh_modal.modal('hide');
	}

	//PI
	def_mesh_7.onclick = function(){
		chargeMesh(node, 'default_meshes/pi.obj');
		node.properties.name = "pi";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
	}

	//Sphere
	def_mesh_8.onclick = function(){
		node.onMeshLoaded(GL.Mesh.sphere());
		node.properties.name = "sphere";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
		mesh_modal.modal('hide');
	}

	//Icosahedron
	def_mesh_9.onclick = function(){
		node.onMeshLoaded(GL.Mesh.icosahedron({size:1,subdivisions:1}));
		node.properties.name = "ico";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
		mesh_modal.modal('hide');
	}

	//Custom mesh
	custom_mesh.onclick = function(){
		var url = url_mesh.value;
		chargeMesh(node, url);

		//Check if the url is valid
		if(!validURL(url))
		{
        	createAlert('Holy Guacamole!','Loading error','URL not valid...','danger',true,true,'pageMessages')
            return;
        }

		url = url.split("/");
		var name = url[url.length - 1];
		name = name.split(".");
		var extension = name[name.length - 1];
		
		//Check if the extension is valid
        if(GL.Mesh.parsers[extension] == undefined)
        {
        	createAlert('Holy Guacamole!','Loading error','Extension not valid...','danger',true,true,'pageMessages')
            return;
        }
		
		//Get the name of the mesh
		var n_name = "";
		for(var i = 0; i < name.length - 1; ++i)
            n_name += name[i];
            
		if(n_name.length > 7)
			n_name = n_name.substring(0, 7);
        
		node.temp_name = n_name;
	}
}