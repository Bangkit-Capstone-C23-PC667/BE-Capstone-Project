const Kuesioner = require('../models/kuesionerModel');
const Kategori = require('../models/kategoriModel');
const Answer = require('../models/answerModel');
const KuesionerKategori = require('../models/kuesionerkategoriModel');
const cheerio = require('cheerio');
const axios = require('axios');
const User = require('../models/userModel');

const Question = require('../models/questionModel');
const QuestionOption = require('../models/questionOptionModel');


// Get all kuesioners
exports.getAllKuesioners = async (req, res) => {
    try {
        const kuesioners = await Kuesioner.findAll();
        if (kuesioners.length === 0) {
            return res.status(404).json({ message: 'No kategori found' });
        }
        const response = {
            status: "success",
            message: "berhasil menampilkan semua data kuesioners",
            data: kuesioners,
        }  
    res.json(response);  
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get a single kuesioner by ID
exports.getKuesionerById = async (req, res) => {
    const { id } = req.params;
    try {
        const kuesioner = await Kuesioner.findByPk(id);
        if (!kuesioner) {
        return res.status(404).json({ message: 'Kuesioner not found' });
        }
        const response = {
            status: "success",
            message: "berhasil menampilkan data kuesioners",
            data: kuesioner,
        }  
    res.json(response);  
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Create a new kuesioner
exports.createKuesioner = async (req, res) => {
    try {
        const { judul, deskripsi, rentang_usia, kategori_id, link, image } = req.body;
        const user = req.user.userId; // Get the user_id from the authenticated user
        // Create the Kuesioner
        const kuesioner = await Kuesioner.create({
            judul,
            deskripsi,
            rentang_usia,
            kategori_id,
            user_id: user,
            link,
            image,
        });
        const kategori_ids = kategori_id
    // Update the KuesionerKategori table with the kategori IDs
    if (kategori_ids && kategori_ids.length > 0) {
        const kuesionerKategoriValues = kategori_ids.map(kategori_id => ({
            kuesioner_id: kuesioner.kuesioner_id,
            kategori_id
        }));
        await KuesionerKategori.bulkCreate(kuesionerKategoriValues);
    }

    // Mengambil halaman HTML Google Form
    const responsehtml = await axios.get(link);
    const html = responsehtml.data;

    // Parsing HTML menggunakan Cheerio
    const $ = cheerio.load(html);

    // Mendapatkan data dari elemen-elemen yang diinginkan
    const formQuestions = [];   
    
    $('.geS5n').each((index, element) => {
        const question = $(element).find('.M7eMe').text();
        let questionType = getQuestionType($(element));
        const questionOptions = []
        if ($(element).find('.SG0AAe').length) {
            questionType = 'pilihan ganda';
            $(element).find('.SG0AAe').children().each((index, element) => {
                questionOptions.push($(element).find('.aDTYNe.snByac.OvPDhc.OIC90c').text());
            });
        }
        formQuestions.push({
            question,
            questionType,
            questionOptions,
        });
    });
    // Simpan data pertanyaan ke dalam tabel Question
    const savedQuestions = [];
    for (const formQuestion of formQuestions) {
    const { question, questionType, questionOptions } = formQuestion;

    const savedQuestion = await Question.create({
        question,
        question_type: questionType,
        kuesioner_id: kuesioner.kuesioner_id,
    });

    if (questionOptions && questionOptions.length > 0) {
        const questionOptionValues = questionOptions.map((option) => ({
            option,
            question_id: savedQuestion.question_id,
        }));
        await QuestionOption.bulkCreate(questionOptionValues);
    }

    savedQuestions.push({
        question: savedQuestion,
        questionOptions,
    });
    
    }
    const response = {
        status: "success",
        message: "berhasil membuat kuesioners",
        data: {
            kuesioner,
            Question_list : savedQuestions,
        }
    }  
    res.status(201).json(response);  
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update a kuesioner
exports.updateKuesioner = async (req, res) => {
    const { id } = req.params;
    const { judul, deskripsi, rentang_usia, kategori_id, user_id, link, image } = req.body;
    try {
        const kuesioner = await Kuesioner.findByPk(id);
        if (!kuesioner) {
            return res.status(404).json({ message: 'Kuesioner not found' });
        }
        kuesioner.judul = judul;
        kuesioner.deskripsi = deskripsi;
        kuesioner.rentang_usia = rentang_usia;
        kuesioner.kategori_id = kategori_id;
        kuesioner.user_id = user_id;
        kuesioner.link = link;
        kuesioner.image = image;
        await kuesioner.save();
        const response = {
            status: "success",
            message: "berhasil mengupdate data kuesioners",
            data: kuesioner,
        }  
    res.json(response);  
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a kuesioner
exports.deleteKuesioner = async (req, res) => {
    const { id } = req.params;
    try {
        const kuesioner = await Kuesioner.findByPk(id);
        if (!kuesioner) {
            return res.status(404).json({ message: 'Kuesioner not found' });
        }
        await kuesioner.destroy();
        res.json({ message: 'Kuesioner deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.testGetkuesioner = async (req, res) => {
    try {
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeGwbglOAMkSzBVUsoe6CeiTne3CZDNQj74osLDlE_g1eDGgg/viewform'; 
    // Mengambil halaman HTML Google Form
    const response = await axios.get(formUrl);
    const html = response.data;

    // Parsing HTML menggunakan Cheerio
    const $ = cheerio.load(html);

    // Mendapatkan data dari elemen-elemen yang diinginkan
    const formTitle = $('.ahS2Le').text();
    const formDescription = $('.cBGGJ.OIC90c').text();
    const formQuestions = [];

    $('.geS5n').each((index, element) => {
    const question = $(element).find('.M7eMe').text();
    //   const questionType = $(element).find('div.freebirdFormviewerComponentsQuestionBaseRoot').attr('data-question-type');
    var questionType = ''  
    var questionOptions= [];
    if ($(element).find('.SG0AAe').length) {
            questionType = 'pilihan ganda'
            $(element).find('.SG0AAe').children().each((index, element) =>{
                questionOptions.push($(element).find('.aDTYNe.snByac.OvPDhc.OIC90c').text())
            })
    }
    else if ($(element).find('.Y6Myld').length){
        questionType = 'pilihan checkbox'
        $(element).find('.Y6Myld').children().eq(1).children().each((index, element) =>{
            questionOptions.push($(element).find('.aDTYNe.snByac.n5vBHf.OIC90c').text())
        })

    }
    else if ($(element).find('.vQES8d').length){
        questionType = 'dropdown'
        // $(element).find('.ry3kXd').children().each((index, element) =>{
        //     questionOptions.push(element.getElementsByClassName('MocG8c HZ3kWc mhLiyf OIC90c LMgvRb').getAttribute())
        // })

    }
    else if ($(element).find('.PY6Xd').length){
        questionType = 'linear scale'

    }
    else if ($(element).find('.E2qMtb').length && $(element).find('.lLfZXe.fnxRtf.EzyPc').length){
        questionType = 'multiple choice grid'
    }
    else if ($(element).find('.e12QUd').length && $(element).find('.EzyPc.mxSrOe').length){
        questionType = 'multiple checkbox grid'

    }
    else if ($(element).find('.o7cIKf').length){
        questionType = 'date'

    }
    else if ($(element).find('.PfQ8Lb').length){
        questionType = 'waktu'

    }
    else if ($(element).find('.rFrNMe.k3kHxc.RdH0ib.yqQS1.zKHdkd').length){
        questionType = 'short answer'

    }
    else if ($(element).find('.edhGSc.zKHdkd.kRy7qc.RdH0ib.yqQS1').length){
        questionType = 'paragraph'

    }
    
    formQuestions.push({
        question,
        questionType,
        questionOptions
    });
    });

    // Menyusun data hasil parsing
    const formData = {
      formTitle,
      formDescription,
      formQuestions
    };

    res.json(formData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

function getQuestionType(element) {
    if (element.find('.SG0AAe').length) {
        return 'pilihan ganda';
    } else if (element.find('.Y6Myld').length) {
        return 'pilihan checkbox';
    } else if (element.find('.vQES8d').length) {
      return 'dropdown';
    } else if (element.find('.PY6Xd').length) {
      return 'linear scale';
    } else if (element.find('.E2qMtb').length && element.find('.lLfZXe.fnxRtf.EzyPc').length) {
      return 'multiple choice grid';
    } else if (element.find('.e12QUd').length && element.find('.EzyPc.mxSrOe').length) {
      return 'multiple checkbox grid';
    } else if (element.find('.o7cIKf').length) {
      return 'date';
    } else if (element.find('.PfQ8Lb').length) {
      return 'waktu';
    } else if (element.find('.rFrNMe.k3kHxc.RdH0ib.yqQS1.zKHdkd').length) {
      return 'short answer';
    } else if (element.find('.edhGSc.zKHdkd.kRy7qc.RdH0ib.yqQS1').length) {
      return 'paragraph';
    } else {
      return '';
    }
}

  // Fungsi untuk mendapatkan opsi pertanyaan
function getQuestionOptions($, element) {
    const questionOptions = [];
  
    if ($(element).find('.SG0AAe').length) {
      $(element).find('.SG0AAe').children().each((index, element) => {
        questionOptions.push($(element).find('.aDTYNe.snByac.OvPDhc.OIC90c').text());
      });
    } else if ($(element).find('.Y6Myld').length) {
      $(element).find('.Y6Myld').children().eq(1).children().each((index, element) => {
        questionOptions.push($(element).find('.aDTYNe.snByac.n5vBHf.OIC90c').text());
      });
    }
  
    return questionOptions;
}

exports.getKuesionerDetail = async (req, res) => {
    try {
        const kuesionerId = req.params.id;
        
        // Ambil data kuesioner berdasarkan ID
        const kuesioner = await Kuesioner.findByPk(kuesionerId);
        
        if (!kuesioner) {
            return res.status(404).json({ message: 'Kuesioner not found' });
        }
        
        // Ambil semua pertanyaan (question) yang terkait dengan kuesioner
        const questions = await Question.findAll({
            where: {
                kuesioner_id: kuesionerId,
            },
            include: {
            model: QuestionOption,
            },
        });
        
        const response = {
            status: 'success',
            message: 'Berhasil mendapatkan detail kuesioner',
            data: {
                kuesioner,
                questions,
            },
        };
        
        res.status(200).json(response);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
        }
};

exports.answerKuesioner = async (req, res) => {
    const { kuesionerId } = req.params;
    const { answers } = req.body;
    const userId = req.user.userId; // Mengakses informasi user yang sedang menjawab

    try {
        const kuesioner = await Kuesioner.findByPk(kuesionerId, { include: Question });
        if (!kuesioner) {
            return res.status(404).json({ error: 'Kuesioner not found' });
        }
        if (!Array.isArray(answers)) {
            return res.status(400).json({ error: 'Invalid answers format' });
        }

        const questions = kuesioner.Questions;
        // console.log(questions)
        if (questions.length === 0) {
            return res.status(400).json({ error: 'No questions found in the kuesioner' });
        }

        // const questions = kuesioner.Questions;
        if (!questions || questions.length === 0 || questions.length !== answers.length) {
            return res.status(400).json({ error: 'Incomplete answers' });
        }

        const answerResults = [];
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const answer = answers[i];

            // Pastikan question_id dan user_id tidak bernilai null
            const questionId = question.question_id;
            const userId = req.user.userId;

            // Simpan jawaban pada model Answer
            const savedAnswer = await Answer.create({
                answer,
                question_id: questionId,
                user_id: userId,
                kuesioner_id: kuesionerId,
            });

            answerResults.push({
                questionId: question.id,
                question: question.question,
                answer: savedAnswer,
            });
        }
        const response = {
            status: "success",
            message: "berhasil menjawab kuesioner",
            data: answerResults,
        }  

        res.status(201).json(response);
    } catch (error) {
        console.error('Error answering kuesioner:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.showUserAnswers = async (req, res) => {
    const kuesionerId = req.params.kuesionerId;
    try {
      // Cari kuesioner berdasarkan ID
    const kuesioner = await Kuesioner.findByPk(kuesionerId);
    if (!kuesioner) {
        return res.status(404).json({ error: 'Kuesioner not found' });
    }

      // Periksa apakah pengguna yang mengakses adalah pembuat kuesioner
    const userId = req.user.userId;
    if (kuesioner.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

      // Cari semua jawaban berdasarkan kuesionerId
    const answers = await Answer.findAll({
        where: { 
            kuesioner_id : kuesionerId 
        },
        include: [{ model: User, attributes: ['nama', 'email'] }],
    });

      // Format data response
    const formattedAnswers = answers.map((answer) => ({
        answerId: answer.answer_id,
        answer: answer.answer,
        userId: answer.User.user_id,
        nama: answer.User.nama,
        email: answer.User.email,
        createdAt: answer.createdAt,
    }));

    const response = {
        status: 'success',
        message: 'Berhasil mendapatkan detail jawaban kuesioner',
        data: {
            formattedAnswers
        },
    };

    res.json(formattedAnswers);
    } catch (error) {
        console.error('Error retrieving user answers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};