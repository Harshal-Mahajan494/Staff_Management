
export async function GET() {
  const dashboardData = {
    totalBookings: 125,
    currentBookings: 8,
    totalRevenue: 45200  // You can consider this in currency like USD or INR
  };

  return Response.json(dashboardData);
}
