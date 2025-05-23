export type TDoctorFilterRequest = {
  name: string | undefined;
  email: string | undefined;
  contactNumber: string | undefined;
  searchTerm: string | undefined;
  registrationNumber: string | undefined;
  qualification: string | undefined;
  designation: string | undefined;
  specialties: string | undefined;
};

export type TSpecialtyUpdate = {
  isDeleted: boolean;
  specialtiesId: string;
};
