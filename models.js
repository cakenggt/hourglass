module.exports = function(sequelize, DataTypes) {
  const TimeEntry = sequelize.define('timeEntry', {
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  const Job = sequelize.define('job', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hourlyRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    taxRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    }
  });
  Job.hasMany(TimeEntry, {
    foreignKey: {
      name: 'jobId',
      allowNull: false
    }
  });
  return {
    sequelize: sequelize,
    TimeEntry: TimeEntry,
    Job: Job
  };
};
