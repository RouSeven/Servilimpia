import { Router } from "express";
const router = Router();
const precios ={
    PET:6,
    HPD:8,
    POLI:7,
    CARTON: .30,
}
//Ruta que enlasa cpn la parte de precios

router.get("/api/precios",(req,res)=>{
res.json(precios);
});
export default router;