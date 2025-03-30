export async function load({ locals }) {
  const user = locals.user;

  console.log(user);

  return { user };
}
