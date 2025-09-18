<?php

require_once 'C:\xampp\htdocs\restaurante\config\config.php';
// Your application logic here
?>

<?php


    class App {
        public $host = "localhost";
        public $port = "3306";
        public $dbname = "restaurante";
        public $user = "root";
        public $pass = "";

        public $link;
    
      //creamos un constructor para la conexion a la base de datos
        function __construct(){
            $this->conect();
            
        }
        public function conect(){

            $this->link = new PDO("mysql:host=".$this->host.";restaurante=".$this->dbname."restaurante", $this->user, $this->pass);

            if($this->link){
                echo "Conexión exitosa";
            }
    }   }
    


    //Seleccionamos todos los registros de la tabla

    function selectAll($query){

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
    function selectOne($query){

        $row = $this->link->query($query);
        $row->execute();

        $singleRow = $row->fetchAll(PDO::FETCH_OBJ);

        if($singleRow){

            return $singleRow;
        
        }else{
        
            return false;
        
        }
    }

    function insert($query,$arr,$path){

        if($this->validate($arr)=="vacio"){
            echo "<script>alert('No se permiten campos vacios');</script>";

        }else{

            $insert_record = $this->link->prepare($query);
            $insert_record->execute($arr);

            header("Location: ".$path."");
    }   }

    function update($query,$arr,$path){

        if($this->validate($arr)=="vacio"){
            echo "<script>alert('No se permiten campos vacios');</script>";

        }else{

            $update_record = $this->link->prepare($query);
            $update_record->execute($arr);

            header("Location: ".$path."");
        }    
    }

    function delete($query,$arr,$path){

            $delete_record = $this->link->prepare($query);
            $delete_record->execute-

            header("Location: ".$path."");
    }

    function validate($arr){

        if($in_array("",$arr)){
            echo "Vacio";
        }
            
    }
    
    $obj = new App();

