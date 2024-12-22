import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs'; import { PrismaService } from 'src/prisma/prisma.service';
;

@Injectable()
export class FootballApiServiceService {
    private readonly API_URL = 'https://v3.football.api-sports.io/standings';
    private readonly API_KEY = '8a9b956142c333a86a210ae13533d168';

    constructor(private readonly httpService: HttpService, private readonly prisma: PrismaService) { }

    async fetchStandings(): Promise<any> {
        try {
            const response = await lastValueFrom(
                this.httpService.get(this.API_URL, {
                    headers: {
                        'x-rapidapi-host': 'v3.football.api-sports.io',
                        'x-rapidapi-key': this.API_KEY,
                    },
                    params: { 
                        league: '202',
                        season: '2022', 
                    },
                }),
            );
            console.log('API Response:', response.data); 
            return response.data.response[0].league.standings[0];
        } catch (error) {
            console.error('Error fetching standings:', error.message);
            throw error;
        }
    }

    async updateTeamStandings(): Promise<void> {

        const standings = await this.fetchStandings();

        for (const teamData of standings) {
            const { team, points, rank, all, goalsDiff } = teamData;

            await this.prisma.team.updateMany({
                where: { name: team.name },
                data: {
                    points: points,
                    position: rank,
                    matchesPlayed: all.played,
                    wins: all.win,
                    draws: all.draw,
                    losses: all.lose,
                    goalsFor: all.goals.for,
                    goalsAgainst: all.goals.against,
                    goalDifference: goalsDiff,
                },
            });
        }

        console.log('Team standings updated successfully!');
    }
}
