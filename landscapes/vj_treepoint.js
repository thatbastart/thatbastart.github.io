class vj_treepoint{
    constructor(title,x,y,size,pos){
        this.title=title;
        this.x=x;
        this.y=y;
        this.size=size;
        this.pos=pos;
        this.sph=undefined;
        this.txt=undefined;
    }

    draw(){
        let sphGeo = new THREE.SphereGeometry( this.size, 16, 16 );
        let matBlue = new THREE.MeshBasicMaterial( { color: blue } ); 
        this.sph=new THREE.Mesh( sphGeo, matBlue );
        vj_tree.add(this.sph);
        this.sph.position.set(this.x,this.y,0);

        let textGeo

        if(this.title.includes("\n") && this.pos!=1){
            textGeo=this.txtAlign();
        } else {
            textGeo = new THREE.TextGeometry(this.title, {font: font, size: 0.8, height: 0, curveSegments: 8} );
        }
        
        
        this.txt=new THREE.Mesh(textGeo,matBlue);
        this.txt.geometry.computeBoundingBox();
        let center = this.txt.geometry.boundingBox.getCenter(new THREE.Vector3());
        let bBox=this.txt.geometry.boundingBox;
        switch(this.pos){
            case 0:
                this.txt.position.set(-center.x,-bBox.min.y+1.2,0.15);
                break;
            case 1:
                this.txt.position.set(1,-center.y,0.15);
                break;
            case 2:
                this.txt.position.set(-center.x,-bBox.max.y-1.2,0.15);
                break;
            case 3:
                this.txt.position.set(-bBox.max.x-1,-center.y,0.15);
                break;
        }
        this.sph.add(this.txt);
    }

    txtAlign(){
        let lines=this.title.split("\n");
        let linesGeo=[];
        let linesMesh=[];
        let longestLine=0;
        for(let i=0;i<lines.length;i++){
            let geo=new THREE.TextGeometry(lines[i], {font: font, size: 0.8, height: 0, curveSegments: 8} );
            linesMesh[i]=new THREE.Mesh(geo);
            linesMesh[i].position.set(0,-(i+1)*1.6,0);
            linesMesh[i].updateMatrix();
            linesMesh[i].geometry.applyMatrix4(linesMesh[i].matrix);
            linesMesh[i].geometry.computeBoundingBox();
            
            if(i>0){
                let bBox=linesMesh[i].geometry.boundingBox;
                let bBoxPrev=linesMesh[i-1].geometry.boundingBox;
                if(bBox.max.x - bBox.min.x > bBoxPrev.max.x - bBoxPrev.min.x){
                    longestLine=i;
                }
            }
        }

        if(this.pos==0 || this.pos==2){
            for(let i=0;i<lines.length;i++){
                let offset=linesMesh[longestLine].geometry.boundingBox.getCenter(new THREE.Vector3()).x - linesMesh[i].geometry.boundingBox.getCenter(new THREE.Vector3()).x;
                linesMesh[i].position.set(offset,0,0);
                linesMesh[i].updateMatrix();
                linesMesh[i].geometry.applyMatrix4(linesMesh[i].matrix);

                linesGeo[i]=linesMesh[i].geometry;
            }
        } else { //this.pos==3 → right align
            for(let i=0;i<lines.length;i++){
                let offset=linesMesh[longestLine].geometry.boundingBox.max.x - linesMesh[i].geometry.boundingBox.max.x;
                linesMesh[i].position.set(offset,0,0);
                linesMesh[i].updateMatrix();
                linesMesh[i].geometry.applyMatrix4(linesMesh[i].matrix);

                linesGeo[i]=linesMesh[i].geometry;
            }
        }

        return BufferGeometryUtils.mergeBufferGeometries(linesGeo, false);
        
    }
}