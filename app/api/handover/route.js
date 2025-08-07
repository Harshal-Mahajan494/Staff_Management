// app/api/handler/route.js

export async function GET() {
  const UserData = [
  {
    id: 1,
    name: 'John Doe',
    pickupLocation: 'Downtown',
    pickupDateTime: '2025-08-01 10:00',
    vehicleType: 'Sedan'
  },
  {
    id: 2,
    name: 'Jane Smith',
    pickupLocation: 'Uptown',
    pickupDateTime: '2025-08-01 12:00',
    vehicleType: 'SUV'
  }
];

  return Response.json(UserData);
}
