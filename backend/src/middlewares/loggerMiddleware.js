<<<<<<< HEAD
/* Função para registrar logs das requisições */
=======
/*  */
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
export default function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}
