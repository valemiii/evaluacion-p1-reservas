require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const prisma = new PrismaClient({adapter: new PrismaPg({connectionString: process.env.DATABASE_URL})});
const variants = [ ['Fútbol 1','Vóley 1','10'], ['Básquet 1','Tenis 1','11'], ['Fútbol 2','Pádel 1','12'], ['Vóley 2','Básquet 2','13'], ['Tenis 2','Fútbol 3','16'], ['Pádel 2','Vóley 3','17'], ['Básquet 3','Ecuavóley 1','18'], ['Ecuavóley 2','Tenis 3','19'], ['Fútbol 4','Básquet 4','20'], ['Pádel 3','Ecuavóley 3','23'] ];
async function main() {
 const portDigits = (process.env.PORT || '').slice(-2);
 const ULTIMOS_DOS_ID_ESPE = /^\d{2}$/.test(portDigits) ? portDigits : '20';
 const NOMBRE_ESTUDIANTE = 'Valeria Naomi Guaiguacundo Aguirre';
 const CORREO_ESTUDIANTE = 'vnguaiguacundo@espe.edu.ec';
 const [a,b,day] = variants[Number(ULTIMOS_DOS_ID_ESPE.slice(-1))];
 const base = `2026-11-${day}`;
 const password = await bcrypt.hash('admin123',10);
 const userPassword = await bcrypt.hash('admin',10);
 await prisma.$transaction(async tx => {
 await tx.booking.deleteMany(); await tx.schedule.deleteMany(); await tx.user.deleteMany();
 await tx.user.create({data:{name:'Paulo Galarza',email:'paulo.galarza@example.com',password,role:'ADMIN'}});
 const user = await tx.user.create({data:{name:NOMBRE_ESTUDIANTE,email:CORREO_ESTUDIANTE.toLowerCase(),password:userPassword,role:'USER'}});
 for(const [court,start,end] of [[a,'08','10'],[b,'10','12']]) {
 const schedule = await tx.schedule.create({data:{court,startTime:new Date(`${base}T${start}:00:00Z`),endTime:new Date(`${base}T${end}:00:00Z`)}});
 await tx.booking.create({data:{date:new Date(`${base}T00:00:00Z`),user:{connect:{id:user.id}},schedule:{connect:{id:schedule.id}}}});
 }
 }); console.log('Seed listo: administrador, estudiante, dos horarios y dos reservas.');
}
main().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(()=>prisma.$disconnect());
