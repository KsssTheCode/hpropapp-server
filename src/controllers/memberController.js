import * as memberService from '../service/memberService.js';

export const createMember = async (req, res, next) => {
   try {
      const response = await memberService.createMemberService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

//멤버 전체를 무리없는 선에서 불러오되, 필터를 이용한 검색 이용 시, Redux state에서 필터링하여 정보제공하는게 어때?
export const getAllMembers = async (req, res, next) => {
   try {
      const response = memberService.getAllMembersService();
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getSelectedMemberData = async (req, res, next) => {
   try {
      const response = await memberService.getSelectedMemberDataService(
         req.query
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getMembersDataInFilterOptions = async (req, res, next) => {
   try {
      const response = await memberService.getMembersInFilterOptionsService(
         req.query
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const editMember = async (req, res, next) => {
   try {
      const response = await memberService.editMemberService(req.body);
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const deleteMember = async (req, res, next) => {
   try {
      const staffId = req.cookies.staffId;
      const response = await memberService.deleteMemberService(
         req.body,
         staffId
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

// export const autoCompeletionWithName = async (req, res, next) => {
//    try {
//       const { name } = req.body;

//       const relatedMemberDatas = await Member.findAll(
//          { attributes: ['name', 'tel'] },
//          { where: { name: { [Op.like]: `%${name}%` } } }
//       );
//       res.status(200).json(relatedMemberDatas);
//    } catch (err) {
//       next(err);
//    }
// };
