/**
 * Created by tinybear on 17/10/11.
 */

export const wrapperMapUser = (u)=>{
    let account = u.account;
    let user = {
        key: u.id.toString(),
        'type': 'people',
        isLeaf: true,
        'properties': {
            'name': account['person_name'],
            'org': account['organization'],
            'phone': account['person_telephone'],
            'project': '前海市政工程V标第二项目部',
            'job': '',
            'personCode': account['person_code'],
            'org_code':account['org_code']
        },
        'geometry': {
            'type': 'Point',
            'coordinates': [account.lat, account.lng]
        }
    };
    return user;
};

export default {}