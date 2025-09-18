<?php

require_once '../config/config.php';
// Your application logic here
?>

<?php


    class App {
        public $host = HOST;
        public $dbname = DBNAME;
        public $user = USER;
        public $pass = PASS;

        public $link;
    
    //creamos un constructor para la conexion a la base de datos
        public function __construct(){
            $this->conect();
            
        }

        public function conect(){
            $this->link = new PDO("mysql:host=".$this->host.";dbname=".$this->dbname."", $this->user, $this->pass);

            if($this->link){
                echo "Conexión exitosa";
            }
    }

    //Seleccionamos todos los registros de la tabla

    public function selectAll($query){

        $rows = $this->link->query($query);
        $rows->execute();

        $allRows = $rows->fetchAll(PDO::FETCH_OBJ);

        if($allRows){
            
            return $allRows;
            
        }else{
            return false;
        }
    }

    //Seleccionamos solo un registro de la tabla
    public function selectOne($query){

        $row = $this->link->query($query);
        $row->execute();

        $singleRow = $row->fetchAll(PDO::FETCH_OBJ);

        if($singleRow){

            return $singleRow;
        
        }else{
        
            return false;
        
        }
    }

    public function insert($query,$arr,$path){

        if($this->validate($arr)=="vacio"){
            echo "<script>alert('No se permiten campos vacios');</script>";

        }else{

            $insert_record = $this->link->prepare($query);
            $insert_record->execute($arr);

            header("Location: ".$path."");
    }

    public function update($query,$arr,$path){

        if($this->validate($arr)=="vacio"){
            echo "<script>alert('No se permiten campos vacios');</script>";

        }else{

            $update_record = $this->link->prepare($query);
            $update_record->execute($arr);

            header("Location: ".$path."");
    }

    public function delete($query,$arr,$path){

            $delete_record = $this->link->prepare($query);
            $delete_record->execute(-);

            header("Location: ".$path."");
    }

    public function validate($arr){

        if($in_array("",$arr)){
            echo "Vacio"

        }
}

    $obj = new App();


