import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const managers = [
    { name: 'Hedi Mokrani', teamName: 'Stade Tunisien' },
    { name: 'Sofiene Hidoussi', teamName: 'CA Bizertin' },
    { name: 'Mouin Chaâbani', teamName: 'Espérance Sportive de Tunis' },
    { name: 'Faouzi Benzarti', teamName: 'Étoile Sportive du Sahel' },
    { name: 'Youssef Zouaoui', teamName: 'Club Africain' },
    { name: 'Nabil Kouki', teamName: 'Club Sportif Sfaxien' },
    { name: 'Mohamed Ali Bouazizi', teamName: 'US Monastir' },
    { name: 'Khaled Ben Yahia', teamName: 'US Ben Guerdane' },
    { name: 'Khaled Ben Sassi', teamName: 'Olympique de Béja' },
    { name: 'Ahmed Dhib', teamName: 'ES Métlaoui' },
    { name: 'Hichem Nsibi', teamName: 'CS Hammam-Lif' },
    { name: 'Mohamed Ali Bouazizi', teamName: 'AS Rejiche' },
  ];

  for (const manager of managers) {
    const team = await prisma.team.findUnique({
      where: { name: manager.teamName },
    });

    if (team) {
      await prisma.manager.create({
        data: {
          name: manager.name,
          teamId: team.id, // Assuming you have a teamId field in the Manager model
        },
      });
      console.log(`Inserted manager ${manager.name} for team ${manager.teamName}`);
    } else {
      console.log(`Team ${manager.teamName} not found`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });