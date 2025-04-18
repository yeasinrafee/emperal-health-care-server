import express from 'express';
import { UserRoutes } from '../modules/User/user.routes';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { authRoutes } from '../modules/Auth/auth.routes';
import { SpecialtiesRoutes } from '../modules/Specialties/specialties.routes';
import { DoctorRoutes } from '../modules/Doctor/doctor.routes';
import { PatientRoutes } from '../modules/Patient/patient.routes';
import { ScheduleRoutes } from '../modules/Schedule/schedule.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/doctor',
    route: DoctorRoutes,
  },
  {
    path: '/patient',
    route: PatientRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/specialties',
    route: SpecialtiesRoutes,
  },
  {
    path: '/schedule',
    route: ScheduleRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
