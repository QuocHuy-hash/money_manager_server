'use strict'

const { GroupMember } = require("../../models");

const checkMemberFamily = async ( userId,groupId ) => {
    console.log("groupId", groupId);
            const membership = await GroupMember.findOne({
                where: {
                    user_id: userId,
                    group_id: groupId,
                    invitation_status: 'accepted'
                }
            });
    return membership ;
}



module.exports = { checkMemberFamily }