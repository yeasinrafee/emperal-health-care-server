import { UserRole } from '@prisma/client';
import prisma from '../src/shared/prisma';

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });

    if (isExistSuperAdmin) {
      console.log('Super Admin already exists.');
    }

    const superAdminData = await prisma.user.create({
      data: {
        email: 'yeasinrafi7@gmail.com',
        password: 'superadmin',
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: 'Yeasin Rafi',
            // email: 'yeasinrafi7@gmail.com',
            contactNumber: '01689786295',
          },
        },
      },
    });

    console.log('Super Admin Created Successfully!', superAdminData);
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
