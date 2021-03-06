const {
  EMC,
  EMCOnSchool,
  Publisher,
  Subject,
  Level,
  User,
  School,
  Area,
} = require('../models');
const { Op } = require('sequelize');

module.exports = async function ({
  schoolId,
  subjectId,
  emcOnSchoolId,
  areaId,
  gia,
  skip,
  limit,
}) {
  console.log({
    msg: 'get_emcs_on_school',
    schoolId,
    subjectId,
    emcOnSchoolId,
    areaId,
    gia,
    skip,
    limit,
  });
  const emcsOnSchool = await EMCOnSchool.findAll({
    attribute: [
      'correctionCoz',
      'studentsCount',
      'swapCoz',
      'usingCoz',
      'isApproved',
    ],
    where: emcOnSchoolId == null ? {} : { id: emcOnSchoolId },
    include: [
      {
        model: EMC,
        where: { gia },
        attributes: [
          'id',
          'title',
          'authors',
          'gia',
          'grades',
          'isCustom',
          'createdBy',
        ],
        include: [
          {
            model: Publisher,
            attributes: [['name', 'publisherName']],
          },
          {
            model: User,
          },
          {
            model: Subject,
            attributes: [
              ['SubjectGlobalID', 'subjectId'],
              ['code', 'subjectCode'],
              ['name', 'subjectName'],
            ],
            where: subjectId == null ? {} : { SubjectGlobalID: subjectId },
          },
          {
            model: Level,
            attributes: ['name', 'code'],
          },
        ],
      },
      {
        model: School,
        attributes: [
          ['id', 'schoolId'],
          ['code', 'schoolCode'],
          ['name', 'schoolName'],
          ['gia', 'schoolGia'],
        ],
        where: schoolId == null ? { gia } : { id: schoolId, gia },
        include: [
          {
            model: Area,
            attributes: [
              ['AreaID', 'areaId'],
              ['code', 'areaCode'],
              ['name', 'areaName'],
              ['gia', 'areaGia'],
            ],
            where:
              areaId == null
                ? { gia: { [Op.in]: [gia, 99] } }
                : { AreaID: areaId, gia: { [Op.in]: [gia, 99] } },
          },
        ],
      },
    ],
    offset: skip ?? 0,
    limit: limit ?? 20,
    subQuery: false,
  });

  const totalEmcsOnSchool = await EMCOnSchool.count({
    attribute: [
      'correctionCoz',
      'studentsCount',
      'swapCoz',
      'usingCoz',
      'isApproved',
    ],
    where: emcOnSchoolId == null ? {} : { id: emcOnSchoolId },
    include: [
      {
        model: EMC,
        where: { gia },
        attributes: [
          'id',
          'title',
          'authors',
          'gia',
          'grades',
          'isCustom',
          'createdBy',
        ],
        include: [
          {
            model: Publisher,
            attributes: [['name', 'publisherName']],
          },
          {
            model: User,
          },
          {
            model: Subject,
            attributes: [
              ['SubjectGlobalID', 'subjectId'],
              ['code', 'subjectCode'],
              ['name', 'subjectName'],
            ],
            where: subjectId == null ? {} : { SubjectGlobalID: subjectId },
          },
          {
            model: Level,
            attributes: ['name', 'code'],
          },
        ],
      },
      {
        model: School,
        attributes: [
          ['id', 'schoolId'],
          ['code', 'schoolCode'],
          ['name', 'schoolName'],
          ['gia', 'schoolGia'],
        ],
        where: schoolId == null ? { gia } : { id: schoolId, gia },
        include: [
          {
            model: Area,
            attributes: [
              ['AreaID', 'areaId'],
              ['code', 'areaCode'],
              ['name', 'areaName'],
              ['gia', 'areaGia'],
            ],
            where:
              areaId == null
                ? { gia: { [Op.in]: [gia, 99] } }
                : { AreaID: areaId, gia: { [Op.in]: [gia, 99] } },
          },
        ],
      },
    ],
    distinct: true,
  });

  return {
    emcsOnSchool,
    totalEmcsOnSchool,
  };
};
