'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create User table
    await queryInterface.createTable('Users', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      umur: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      confirm_password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      poin: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png',
      },
      pekerjaan: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '-',
      },  
      asal: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '-',
      },  
      hobi: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '-',
      },
      pendidikan: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '-',
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });

    // Create Kategori table
    await queryInterface.createTable('Kategoris', {
      kategori_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      kategori_nama: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      kategori_desc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Create Kuesioner table
    await queryInterface.createTable('Kuesioners', {
      kuesioner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      judul: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      rentang_usia: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      kategori_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Kategoris',
          key: 'kategori_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rata_rata_rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      jumlah_rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: false,
      },  
      image: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'https://www.interprint-services.co.uk/wp-content/uploads/2019/04/placeholder-banner.png',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Create KuesionerKategori table
    await queryInterface.createTable('KuesionerKategoris', {
      kuesionerkategori_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      kuesioner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Kuesioners',
          key: 'kuesioner_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      kategori_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Kategoris',
          key: 'kategori_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop KuesionerKategori table
    await queryInterface.dropTable('KuesionerKategoris');
    
    // Drop Kuesioner table
    await queryInterface.dropTable('Kuesioners');

    // Drop Kategori table
    await queryInterface.dropTable('Kategoris');
    
    // Drop User table
    await queryInterface.dropTable('Users');
  }
};
