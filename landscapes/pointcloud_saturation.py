from colorutils import Color
from colorutils import rgb_to_hsv
from colorutils import hsv_to_rgb

file="pointcloud_data.ply"
factor_s=2
factor_v=1.5

src = open(file, "r")
out = open(file.split(".")[0]+"_mod.ply", "a")
Lines = src.readlines()
flag=False
 
count = 0
for line in Lines:
    count += 1
    line=line.strip()
    
    if flag==True:
        arr=line.split(" ")
        hsv=rgb_to_hsv((int(arr[6]),int(arr[7]),int(arr[8])))
        sat=hsv[1]*factor_s
        if sat>1.0:
            sat=1.0

        val=hsv[2]*factor_v
        if val>1.0:
            val=1.0
        rgb=hsv_to_rgb((hsv[0],sat,val))
        out.write(arr[0]+" "+arr[1]+" "+arr[2]+" "+arr[3]+" "+arr[4]+" "+arr[5]+" "+str(int(rgb[0]))+" "+str(int(rgb[1]))+" "+str(int(rgb[2]))+"\n")
    else:
        out.write(line+"\n")

    if line=="end_header":
        flag=True
        