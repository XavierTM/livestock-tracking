
const { Model, Sequelize, DataTypes } = require('sequelize');


class Storage extends Model {

	static init(sequelize) {
		super.init({
			coordinateLastUpdatedAt: DataTypes.STRING,
			coordinates: DataTypes.STRING,
			center: DataTypes.STRING,
			radius: DataTypes.STRING,
			distanceFromCenter: DataTypes.STRING,
			outOfBounds: DataTypes.BOOLEAN
		}, { sequelize });
	}
}


async function init() {

	const dialect = `sqlite::${__dirname}/db.sqlite`;
	const sequelize = new Sequelize(dialect, { logging: false, dialect: 'sqlite' });

	await Storage.init(sequelize);
	await sequelize.sync();

	const storage = await Storage.findOne();

	if (!storage) {
		await Storage.create({
			coordinateLastUpdatedAt: '0',
			coordinates: '{"lat": 0, "long": 0}',
			center: '{"lat": 0, "long": 0}',
			radius: '10',
			outOfBounds: false,
			distanceFromCenter: '0'
		});
	}
}


module.exports = {
	Storage,
	init
}