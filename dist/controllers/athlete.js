"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getAthletes(request, response) {
    console.log('getAthletes');
    const athletes = [
        {
            id: '2843574',
            nickname: 'Dad',
            firstName: 'Ted',
            lastName: 'Shaffer',
            email: 'shaffer.family@gmail.com',
        },
        {
            id: '7085811',
            nickname: 'Mom',
            firstName: 'Lori',
            lastName: 'Shaffer',
            email: 'loriashaffer@gmail.com',
        },
    ];
    response.json(athletes);
}
exports.getAthletes = getAthletes;
//# sourceMappingURL=athlete.js.map