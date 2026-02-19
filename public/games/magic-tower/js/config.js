/**
 * 游戏配置类
 * 对应Python版本的Config类
 */
class Config {
    constructor() {
        // 屏幕大小
        this.BLOCKSIZE = 54;
        this.SCREENBLOCKSIZE = [18, 13];
        this.SCREENSIZE = [
            this.BLOCKSIZE * this.SCREENBLOCKSIZE[0],
            this.BLOCKSIZE * this.SCREENBLOCKSIZE[1]
        ];
        
        // 标题
        this.TITLE = '魔塔 —— H5版本';
        
        // FPS
        this.FPS = 30;
        
        // 字体设置
        this.FONT_SIZE = 40;
        this.FONT_SIZE_SMALL = 20;
        this.FONT_FAMILY = 'Microsoft YaHei, SimHei, Arial, sans-serif';
        
        // 游戏地图路径 (28个关卡，0-27)
        this.MAPPATHS = [];
        for (let i = 0; i < 28; i++) {
            this.MAPPATHS.push(`resources/levels/${i}.lvl`);
        }
        
        // 游戏图片路径
        this.IMAGE_PATHS_DICT = {
            'battlebg': 'resources/images/battlebg.png',
            'blankbg': 'resources/images/blankbg.png',
            'gamebg': 'resources/images/gamebg.png',
            'hero': {},
            'mapelements': {}
        };
        
        // 地图元素图片 (从map0和map1文件夹)
        // 这些需要在ResourceLoader中动态加载
        this.MAP_ELEMENT_IDS = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            '10', '11', '12', '13', '14', '15', '19', '20', '21',
            '22', '23', '24', '25', '26', '27', '28',
            '30', '31', '32', '33', '34', '35', '36', '38', '39',
            '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
            '50', '51', '52', '53', '54', '55', '56', '57', '58', '59',
            '60', '61', '62', '63', '64', '65', '66', '67', '68', '69',
            '70', '71', '73', '75', '76', '78', '80',
            '181', '182', '183', '184', '185', '186', '187', '188', '189',
            '191', '192', '193', '194', '195', '196', '197', '198', '199',
            '202', '203', '340'
        ];
        
        // 英雄图片
        this.HERO_IMAGES = ['down', 'left', 'right', 'up'];
        
        // 存档路径（使用localStorage）
        this.SAVE_KEY = 'magictower_save_data';
    }
}
