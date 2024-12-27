import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFantasyTeamDto } from './dto/create-fantasy-team.dto';

@Injectable()
export class FantasyService {
    constructor(private prisma: PrismaService) { }

    async createFantasyTeam(createFantasyTeamDto: CreateFantasyTeamDto, userId: number) {
        const { name, playerIds } = createFantasyTeamDto;

        if (!playerIds || !Array.isArray(playerIds)) {
            throw new NotFoundException('Player IDs must be provided as an array.');
        }

        // Check if players exist
        const players = await this.prisma.player.findMany({
            where: { id: { in: playerIds } },
        });

        if (players.length !== playerIds.length) {
            throw new Error('One or more players do not exist.');
        }

        const existingTeam = await this.prisma.fantasyTeam.findFirst({
            where: { userId: userId },
        });

        if (existingTeam) {
            throw new ConflictException('User can only create one fantasy team');
        }
        // Create the fantasy team
        return this.prisma.fantasyTeam.create({
            data: {
                name,
                userId,
                players: {
                    connect: playerIds.map(id => ({ id })),
                },
            },
        });
    }

    async updatePointsAfterMatch(matchId: number) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: { homeTeam: true, awayTeam: true },
        });

        if (!match) {
            throw new Error('Match not found.');
        }

        const homeGoals = match.homeGoals;
        const awayGoals = match.awayGoals;

        // Get players from both teams
        const homePlayers = await this.prisma.player.findMany({
            where: { team_id: match.home_team_id },
        });

        const awayPlayers = await this.prisma.player.findMany({
            where: { team_id: match.away_team_id },
        });

        // Calculate points for home players
        for (const player of homePlayers) {
            const goals = player.goals; // Goals scored by the player
            const assists = player.assists; // Assists made by the player
            const goalsAgainst = awayGoals; // Goals conceded by the home team

            // Calculate points
            const points = (goals * 4) + (assists * 3) - (goalsAgainst * 1);

            // Find all fantasy teams that include this player
            const fantasyTeams = await this.prisma.fantasyTeam.findMany({
                where: { players: { some: { id: player.id } } },
            });

            // Update points for each fantasy team
            for (const team of fantasyTeams) {
                await this.prisma.fantasyTeam.update({
                    where: { id: team.id },
                    data: { totalPoints: { increment: points } },
                });
            }
        }

        // Calculate points for away players
        for (const player of awayPlayers) {
            const goals = player.goals; // Goals scored by the player
            const assists = player.assists; // Assists made by the player
            const goalsAgainst = homeGoals; // Goals conceded by the away team

            // Calculate points
            const points = (goals * 4) + (assists * 3) - (goalsAgainst * 1);

            // Find all fantasy teams that include this player
            const fantasyTeams = await this.prisma.fantasyTeam.findMany({
                where: { players: { some: { id: player.id } } },
            });

            // Update points for each fantasy team
            for (const team of fantasyTeams) {
                await this.prisma.fantasyTeam.update({
                    where: { id: team.id },
                    data: { totalPoints: { increment: points } },
                });
            }
        }
    }

    async getLeaderboard() {
        return this.prisma.fantasyTeam.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true, 
                    },
                },
            },
            orderBy: {
                totalPoints: 'desc',
            },
        });
    }

    async addPlayerToFantasyTeam(userId: number, playerId: number) {
        // Fetch the user's fantasy team
        const fantasyTeam = await this.prisma.fantasyTeam.findUnique({
            where: { userId: userId },
            include: { players: true }, // Include players to check existence
        });

        if (!fantasyTeam) {
            throw new NotFoundException('Fantasy team not found for this user');
        }

        // Check if the player already exists in the fantasy team
        const playerExists = fantasyTeam.players.some(player => player.id === playerId);
        if (playerExists) {
            throw new ConflictException('Player already exists in the fantasy team');
        }

        // Append the new player
        return this.prisma.fantasyTeam.update({
            where: { id: fantasyTeam.id },
            data: {
                players: {
                    connect: { id: playerId },
                },
            },
        });
    }

    async removePlayerFromFantasyTeam(userId: number, playerId: number) {
        // Fetch the user's fantasy team
        const fantasyTeam = await this.prisma.fantasyTeam.findUnique({
            where: { userId: userId },
            include: { players: true }, // Include players to check existence
        });

        if (!fantasyTeam) {
            throw new NotFoundException('Fantasy team not found for this user');
        }

        // Check if the player exists in the fantasy team
        const playerExists = fantasyTeam.players.some(player => player.id === playerId);
        if (!playerExists) {
            throw new NotFoundException('Player not found in the fantasy team');
        }

        // Delete the existing player
        return this.prisma.fantasyTeam.update({
            where: { id: fantasyTeam.id },
            data: {
                players: {
                    disconnect: { id: playerId },
                },
            },
        });
    }

    async getUserFantasyTeam(userId: number) {
        const fantasyTeam = await this.prisma.fantasyTeam.findUnique({
            where: { userId: userId },
            include: { players: true }, // Include players in the response
        });

        if (!fantasyTeam) {
            throw new NotFoundException('Fantasy team not found for this user');
        }

        return fantasyTeam;
    }

    async getFantasyTeamByUserId(userId: number) {
        // Ensure userId is treated as a number
        const fantasyTeam = await this.prisma.fantasyTeam.findUnique({
            where: { userId: userId }, // userId should be a number
            include: { players: true }, // Include players in the response
        });

        if (!fantasyTeam) {
            throw new NotFoundException('Fantasy team not found for this user');
        }

        return fantasyTeam;
    }
}