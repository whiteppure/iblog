---
title: "Java小程序集合"
date: 2022-04-09
draft: false
tags: ["Java", "玩具"]
slug: "java-multi-gadget"
---

## 写在前面
本文中所涉及的程序均为Java开发，如果您想要直接使用这些工具需要提前配置Java环境。所涉及到的程序均提供完整代码，如果您有兴趣可以尝试运行。

使用`java -jar`命令启动

![Java玩具-009](/iblog/posts/annex/images/readme/Java玩具-009.png)

某些程序功能并不是很完善，但是也可以凑合着用，写这些程序的主要目的是为了方便理解一些常用软件的实现逻辑。

## 强密码生成器
生成6到20位的随机强密码，可指定密码长度、密码内容。[点击下载](/iblog/posts/annex/jar/auto-pwd.jar)

![Java玩具-001](/iblog/posts/annex/images/readme/Java玩具-001.png)
### 代码
```java
/**
 * 随机生成字符抽象类
 */
public abstract class AbstractRandomChar {

    protected static final String LOW_STR = "abcdefghijklmnopqrstuvwxyz";
    protected static final String UPPER_STR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    protected static final String SPECIAL_STR = "~!@#$%^&*()_+/|-=[]{};:'<>?.";
    protected static final String NUM_STR = "0123456789";


    /**
     * 根据字符串获取随机获取字符
     *
     * @param str 指定字符串
     * @return 返回一个随机字符
     */
    protected char getRandomChar(String str) {
        SecureRandom random = new SecureRandom();
        return str.charAt(random.nextInt(str.length()));
    }

    /**
     * 获取随机字符，根据不同的子类不同的实现。现有类型，随机数字、随机大些字母、随机小写字母、随机特殊字符
     *
     * @return 随机字符
     */
    protected abstract char getRandomChar();

}
```

```java
public class RandomLowChar extends AbstractRandomChar {

    /**
     * 随机获取小写字符
     * @return 随机小写字符
     */
    @Override
    public char getRandomChar() {
        return getRandomChar(LOW_STR);
    }
}
```

```java
public class RandomNumChar extends AbstractRandomChar {

    /**
     * 获取随机获取数字字符
     * @return 随机获取数字字符
     */
    @Override
    public char getRandomChar() {
        return getRandomChar(NUM_STR);
    }
}
```

```java
public class RandomSpecialChar extends AbstractRandomChar {

    /**
     * 获取随机获取特殊字符
     * @return 随机大写字符
     */
    @Override
    public char getRandomChar() {
        return getRandomChar(SPECIAL_STR);
    }
}
```

```java
public class RandomUpperChar extends AbstractRandomChar {

    /**
     * 随机获取大写字符
     * @return 随机大写字符
     */
    @Override
    public char getRandomChar() {
        return getRandomChar(UPPER_STR);
    }
}
```

```java
/**
 * 生成随机密码
 */
public class GenRandomPwd {

    /**
     * 保存 AbstractRandomChar 对象,用于随机数生成
     */
    private final List<AbstractRandomChar> randomCharList = new ArrayList<>();

    public GenRandomPwd(boolean genNumCharPwd, boolean genLowCharPwd, boolean genUpperCharPwd, boolean genSpecialCharPwd) {

        if (genNumCharPwd) {
            randomCharList.add(new RandomNumChar());
        }

        if (genLowCharPwd) {
            randomCharList.add(new RandomLowChar());
        }

        if (genUpperCharPwd) {
            randomCharList.add(new RandomUpperChar());
        }

        if (genSpecialCharPwd) {
            randomCharList.add(new RandomSpecialChar());
        }

        // 默认都是false的情况下 指定只用数字生成随机数字
        if (randomCharList.isEmpty()) {
            randomCharList.add(new RandomNumChar());
        }
    }


    public String getRandomPwd(int length) {
        // 密码最大长度
        int maxPwdLength = 25;
        // 密码最小长度
        int minPwdLength = 6;
        if (length > maxPwdLength || length < minPwdLength) {
            System.out.printf("密码长度在%d～%d位之间", minPwdLength, maxPwdLength);
            return "";
        }
        // 创建集合将随机生成的字符放入到集合中
        List<Character> list = new ArrayList<>(length);

        // 产生随机数用于随机调用生成字符的函数
        int randomListSize = randomCharList.size();
        for (int i = 0; i < length; i++) {
            int randomCharNum = new SecureRandom().nextInt(randomListSize);
            // 随机从randomCharList中获取一个字符，并加入到list中
            list.add(randomCharList.get(randomCharNum).getRandomChar());
        }

        // 将选好的list打乱顺序重新排序
        Collections.shuffle(list);

        // 将char类型转string字符串
        StringBuilder result = new StringBuilder(list.size());
        for (Character c : list) {
            result.append(c);
        }
        return result.toString();
    }
    
}
```

```java
public class PwdFrame {

    public void init() {
        Frame f = new Frame("强密码生成器");
        String pwdNumContent = "123";
        String pwdLowContent = "abc";
        String pwdUpperContent = "ABC";
        String pwdSpecialContent = "!@#";

        // 一些组件
        TextField tf = new TextField(22);
        f.setBounds(600, 250, 280, 140);
        JButton genPwdBtn = new JButton("生成");
        JLabel lenLabel = new JLabel("长度", JLabel.LEFT);
        JLabel contentLabel = new JLabel("内容", JLabel.LEFT);
        JPanel panel1 = new JPanel(new FlowLayout());
        JPanel panel2 = new JPanel(new FlowLayout());

        // 密码长度单选框
        ButtonGroup lenGroup = new ButtonGroup();
        JRadioButton len1 = new JRadioButton("6", true);
        JRadioButton len2 = new JRadioButton("8");
        JRadioButton len3 = new JRadioButton("14");
        JRadioButton len4 = new JRadioButton("16");
        JRadioButton len5 = new JRadioButton("20");
        lenGroup.add(len1);
        lenGroup.add(len2);
        lenGroup.add(len3);
        lenGroup.add(len4);
        lenGroup.add(len5);

        // 密码内容复选框
        JRadioButton content1 = new JRadioButton(pwdNumContent, true);
        JRadioButton content2 = new JRadioButton(pwdLowContent);
        JRadioButton content3 = new JRadioButton(pwdUpperContent);
        JRadioButton content4 = new JRadioButton(pwdSpecialContent);

        // 将组件添加到 panel
        panel1.add(lenLabel);
        panel1.add(len1);
        panel1.add(len2);
        panel1.add(len3);
        panel1.add(len4);
        panel1.add(len5);

        panel2.add(contentLabel);
        panel2.add(content1);
        panel2.add(content2);
        panel2.add(content3);
        panel2.add(content4);


        // 设置按钮功能
        genPwdBtn.addActionListener(e -> {
            // 获取密码长度单选框的值
            String checkBoxValLength = getCheckBoxVal(panel1);

            // 获取密码内容单选框的值
            String checkBoxValContent = getCheckBoxVal(panel2);
            boolean numPwd = checkBoxValContent.contains(pwdNumContent);
            boolean lowPwd = checkBoxValContent.contains(pwdLowContent);
            boolean upperPwd = checkBoxValContent.contains(pwdUpperContent);
            boolean specialPwd = checkBoxValContent.contains(pwdSpecialContent);

            // 生成强密码
            GenRandomPwd genRandomPwd = new GenRandomPwd(numPwd, lowPwd, upperPwd, specialPwd);
            tf.setText(genRandomPwd.getRandomPwd(Integer.parseInt(checkBoxValLength)));

            // 获取光标，使光标一直在文本框内
            tf.requestFocus();
        });

        f.add(tf);
        f.add(genPwdBtn);
        f.add(panel1);
        f.add(panel2);
        f.setResizable(false);

        //设置窗体布局模式为流式布局
        f.setLayout(new FlowLayout());

        //关闭窗口
        f.addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                System.exit(0);
            }
        });
        f.setVisible(true);
    }


    /**
     * 获取单选框、复选框的值
     *
     * @param panel panel对象
     * @return 单选框的值
     */
    public String getCheckBoxVal(JPanel panel) {
        StringBuilder info = new StringBuilder();
        for (Component c : panel.getComponents()) {
            if (c instanceof JRadioButton && ((JRadioButton) c).isSelected()) {
                // 按空格拆分获取复选框的值
                info.append(((JRadioButton) c).getText());
            }
        }
        return info.toString();
    }

}
```

```java
public class AutoPwdMainStarter {
    public static void main(String[] args) {
        new PwdFrame().init();
    }
}
```
## 截图工具
截图小工具，支持复制到粘贴板、一次性截取多张图片。[点击下载](/iblog/posts/annex/jar/cut-screen.jar)

![Java玩具-002](/iblog/posts/annex/images/readme/Java玩具-002.png)

![Java玩具-003](/iblog/posts/annex/images/readme/Java玩具-003.png)
### 代码
```java
/**
 * 截屏小工具 参考：https://blog.csdn.net/Code__rookie/article/details/103509851 有改动
 * @author whitepure
 */
public class CaptureScreen extends JFrame implements ActionListener {
    private JButton start, cancel;
    private JPanel c;
    private BufferedImage get;
    private final JTabbedPane jtp;
    private int index;

    public CaptureScreen() {
        super("屏幕截取");
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception exe) {
            System.out.println("截图异常");
            exe.printStackTrace();
        }
        initWindow();
        jtp = new JTabbedPane(JTabbedPane.TOP, JTabbedPane.SCROLL_TAB_LAYOUT);
    }


    /**
     * 初始化窗口
     */
    private void initWindow() {
        start = new JButton("开始截取");
        cancel = new JButton("退出");
        start.addActionListener(this);
        cancel.addActionListener(this);

        JPanel panel = new JPanel();
        JPanel all = new JPanel();

        c = new JPanel(new BorderLayout());
        panel.add(start);
        panel.add(cancel);

        all.add(panel);
        this.getContentPane().add(c, BorderLayout.CENTER);
        this.getContentPane().add(all, BorderLayout.SOUTH);
        setFrameSizeDefault();
        this.setVisible(true);
        this.setAlwaysOnTop(true);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setResizable(false);
    }

    /**
     * 设置窗口size 位置
     */
    private void setFrameSizeWhenExitsImg() {
        this.setSize(720, 620);
        this.setLocation(400,150);
    }

    /**
     * 设置窗口size 位置
     */
    private void setFrameSizeDefault() {
        this.setSize(180, 80);
        this.setLocation(600,300);
    }

    private void updates() {
        this.setVisible(true);
        if (get == null) {
            return;
        }
        // 如果索引是0,则表示一张图片都没有被加入过,则要清除当前的东西,重新把tabpane放进来
        if (index == 0) {
            c.removeAll();
            c.add(jtp, BorderLayout.CENTER);
        }
        PicPanel pic = new PicPanel(get);
        jtp.addTab("图片" + (++index), pic);
        jtp.setSelectedComponent(pic);
        SwingUtilities.updateComponentTreeUI(c);
    }


    /**
     * 点击开始截屏执行
     */
    private void doStart() {
        // 点击截屏后隐藏主界面并 sleep 500ms 彻底隐藏主界面
        this.setVisible(false);
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        Dimension dimension = Toolkit.getDefaultToolkit().getScreenSize();
        Rectangle rec = new Rectangle(0, 0, dimension.width, dimension.height);
        BufferedImage bi = null;
        try {
            bi = new Robot().createScreenCapture(rec);
        } catch (AWTException e) {
            e.printStackTrace();
        }
        JFrame jf = new JFrame();
        // 自定义的截屏时窗口对象，调整大小然后开始截图
        CutScreen temp = new CutScreen(jf, bi, dimension.width, dimension.height);
        jf.getContentPane().add(temp, BorderLayout.CENTER);

        jf.setUndecorated(true);
        jf.setSize(dimension);
        jf.setVisible(true);
        jf.setAlwaysOnTop(true);

        // 设置当前窗口大小
        setFrameSizeWhenExitsImg();
    }

    /**
     * 公用的处理保存图片的方法
     */
    public void doSave(BufferedImage get) {
        try {
            if (get == null) {
                JOptionPane.showMessageDialog(this
                        , "图片不能为空!!", "错误", JOptionPane.ERROR_MESSAGE);
                return;
            }
            JFileChooser jfc = new JFileChooser(".");
            jfc.addChoosableFileFilter(new gifFilter());
            jfc.addChoosableFileFilter(new bmpFilter());
            jfc.addChoosableFileFilter(new jpgFilter());
            jfc.addChoosableFileFilter(new pngFilter());
            int i = jfc.showSaveDialog(this);
            if (i == JFileChooser.APPROVE_OPTION) {
                File file = jfc.getSelectedFile();
                String about = "PNG";
                String ext = file.toString().toLowerCase();
                javax.swing.filechooser.FileFilter ff = jfc.getFileFilter();
                if (ff instanceof jpgFilter) {
                    if (!ext.endsWith(".jpg")) {
                        String ns = ext + ".jpg";
                        file = new File(ns);
                        about = "JPG";
                    }
                } else if (ff instanceof pngFilter) {
                    if (!ext.endsWith(".png")) {
                        String ns = ext + ".png";
                        file = new File(ns);
                        about = "PNG";
                    }
                } else if (ff instanceof bmpFilter) {
                    if (!ext.endsWith(".bmp")) {
                        String ns = ext + ".bmp";
                        file = new File(ns);
                        about = "BMP";
                    }
                } else if (ff instanceof gifFilter) {
                    if (!ext.endsWith(".gif")) {
                        String ns = ext + ".gif";
                        file = new File(ns);
                        about = "GIF";
                    }
                }
                if (ImageIO.write(get, about, file)) {
                    JOptionPane.showMessageDialog(this, "保存成功！");
                } else {
                    JOptionPane.showMessageDialog(this, "保存失败！");
                }
            }
        } catch (Exception exe) {
            exe.printStackTrace();
        }
    }

    /**
     * 公共的处理把当前的图片加入剪帖板的方法
     */
    public void doCopy(final BufferedImage image) {
        try {
            if (get == null) {
                JOptionPane.showMessageDialog(this
                        , "图片不能为空!!", "错误", JOptionPane.ERROR_MESSAGE);
                return;
            }

            Transferable trans = new Transferable() {
                @Override
                public DataFlavor[] getTransferDataFlavors() {
                    return new DataFlavor[]{DataFlavor.imageFlavor};
                }

                @Override
                public boolean isDataFlavorSupported(DataFlavor flavor) {
                    return DataFlavor.imageFlavor.equals(flavor);
                }

                @Override
                public Object getTransferData(DataFlavor flavor)
                        throws UnsupportedFlavorException, IOException {
                    if (isDataFlavorSupported(flavor)) {
                        return image;
                    }
                    throw new UnsupportedFlavorException(flavor);
                }
            };

            Toolkit.getDefaultToolkit().getSystemClipboard().setContents(trans, null);
            JOptionPane.showMessageDialog(this, "已复制到系统粘帖板!!");
        } catch (Exception exe) {
            exe.printStackTrace();
            JOptionPane.showMessageDialog(this
                    , "复制到系统粘帖板出错!!", "错误", JOptionPane.ERROR_MESSAGE);
        }
    }

    /**
     * 处理关闭事件
     * @param c 窗口对象
     */
    private void doClose(Component c) {
        jtp.remove(c);
        if (jtp.getTabCount() == 0){
            // 将当前截屏的窗口重置为初始化状态
            setFrameSizeDefault();
        }
        c = null;
        System.gc();
    }

    /**
     * 判断当前按钮发生的事件
     *
     * @param ae 事件对象
     */
    @Override
    public void actionPerformed(ActionEvent ae) {
        Object source = ae.getSource();
        if (source == start) {
            doStart();
            return;
        }
        if (source == cancel) {
            System.exit(0);
            return;
        }
        try {
            UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName());
            SwingUtilities.updateComponentTreeUI(this);
        } catch (Exception exe) {
            exe.printStackTrace();
        }
    }


    /**
     * 截图后预览截图的panel
     */
    private class PicPanel extends JPanel implements ActionListener {
        JButton save;
        JButton copy;
        JButton close;
        BufferedImage get;

        public PicPanel(BufferedImage get) {
            super(new BorderLayout());
            this.get = get;
            initPanel();
        }

        /**
         * 初始化
         */
        private void initPanel() {
            save = new JButton("保存");
            copy = new JButton("复制到剪帖板");
            close = new JButton("删除");

            JPanel buttonPanel = new JPanel();
            buttonPanel.add(copy);
            buttonPanel.add(save);
            buttonPanel.add(close);
            JLabel icon = new JLabel(new ImageIcon(get));
            this.add(new JScrollPane(icon), BorderLayout.CENTER);
            this.add(buttonPanel, BorderLayout.SOUTH);

            save.addActionListener(this);
            copy.addActionListener(this);
            close.addActionListener(this);
        }

        /**
         * 判断当前按钮点击发生的事件
         *
         * @param e 事件对象
         */
        @Override
        public void actionPerformed(ActionEvent e) {
            Object source = e.getSource();
            if (source == save) {
                doSave(get);
            } else if (source == copy) {
                doCopy(get);
            } else if (source == close) {
                get = null;
                doClose(this);
            }
        }
    }

    // 保存BMP格式的过滤器
    private class bmpFilter extends javax.swing.filechooser.FileFilter {
        public bmpFilter() {
        }

        @Override
        public boolean accept(File file) {
            if (file.toString().toLowerCase().endsWith(".bmp") ||
                    file.isDirectory()) {
                return true;
            } else {
                return false;
            }
        }

        @Override
        public String getDescription() {
            return "*.BMP(BMP图像)";
        }
    }

    // 保存JPG格式的过滤器
    private class jpgFilter extends javax.swing.filechooser.FileFilter {
        public jpgFilter() {
        }

        @Override
        public boolean accept(File file) {
            if (file.toString().toLowerCase().endsWith(".jpg") ||
                    file.isDirectory()) {
                return true;
            } else {
                return false;
            }
        }

        @Override
        public String getDescription() {
            return "*.JPG(JPG图像)";
        }
    }

    // 保存GIF格式的过滤器
    private class gifFilter extends javax.swing.filechooser.FileFilter {
        public gifFilter() {
        }

        @Override
        public boolean accept(File file) {
            return file.toString().toLowerCase().endsWith(".gif") ||
                    file.isDirectory();
        }

        @Override
        public String getDescription() {
            return "*.GIF(GIF图像)";
        }
    }

    // 保存PNG格式的过滤器
    private class pngFilter extends javax.swing.filechooser.FileFilter {
        @Override
        public boolean accept(File file) {
            return file.toString().toLowerCase().endsWith(".png") ||
                    file.isDirectory();
        }

        @Override
        public String getDescription() {
            return "*.PNG(PNG图像)";
        }
    }

    /**
     * 显示当前的屏幕图像
     */
    private class CutScreen extends JPanel implements MouseListener, MouseMotionListener {
        public static final int START_X = 1;
        public static final int START_Y = 2;
        public static final int END_X = 3;
        public static final int END_Y = 4;
        private final BufferedImage bi;
        private final int width;
        private final int height;
        private final JFrame jf;
        //表示一般情况下的鼠标状态（十字线）
        private final Cursor cs = new Cursor(Cursor.CROSSHAIR_CURSOR);
        private int startX, startY, endX, endY, tempX, tempY;
        //表示选中的区域
        private Rectangle select = new Rectangle(0, 0, 0, 0);
        // 表示当前的编辑状态
        private States current = States.DEFAULT;
        //表示八个编辑点的区域
        private Rectangle[] rec;
        //当前被选中的X和Y,只有这两个需要改变
        private int currentX, currentY;
        //当前鼠标移的地点
        private Point p = new Point();
        //是否显示提示.如果鼠标左键一按,则提示就不再显示了
        private boolean showTip = true;

        public CutScreen(JFrame jf, BufferedImage bi, int width, int height) {
            this.jf = jf;
            this.bi = bi;
            this.width = width;
            this.height = height;
            this.addMouseListener(this);
            this.addMouseMotionListener(this);
            initRecs();
        }

        private void initRecs() {
            rec = new Rectangle[8];
            for (int i = 0; i < rec.length; i++) {
                rec[i] = new Rectangle();
            }
        }

        @Override
        public void paintComponent(Graphics g) {
            g.drawImage(bi, 0, 0, width, height, this);
            g.setColor(Color.RED);
            g.drawLine(startX, startY, endX, startY);
            g.drawLine(startX, endY, endX, endY);
            g.drawLine(startX, startY, startX, endY);
            g.drawLine(endX, startY, endX, endY);

            int x = Math.min(startX, endX);
            int y = Math.min(startY, endY);
            select = new Rectangle(x, y, Math.abs(endX - startX), Math.abs(endY - startY));
            int x1 = (startX + endX) / 2;
            int y1 = (startY + endY) / 2;

            g.fillRect(x1 - 2, startY - 2, 5, 5);
            g.fillRect(x1 - 2, endY - 2, 5, 5);
            g.fillRect(startX - 2, y1 - 2, 5, 5);
            g.fillRect(endX - 2, y1 - 2, 5, 5);
            g.fillRect(startX - 2, startY - 2, 5, 5);
            g.fillRect(startX - 2, endY - 2, 5, 5);
            g.fillRect(endX - 2, startY - 2, 5, 5);
            g.fillRect(endX - 2, endY - 2, 5, 5);

            rec[0] = new Rectangle(x - 5, y - 5, 10, 10);
            rec[1] = new Rectangle(x1 - 5, y - 5, 10, 10);
            rec[2] = new Rectangle((Math.max(startX, endX)) - 5, y - 5, 10, 10);
            rec[3] = new Rectangle((Math.max(startX, endX)) - 5, y1 - 5, 10, 10);
            rec[4] = new Rectangle((Math.max(startX, endX)) - 5, (Math.max(startY, endY)) - 5, 10, 10);
            rec[5] = new Rectangle(x1 - 5, (Math.max(startY, endY)) - 5, 10, 10);
            rec[6] = new Rectangle(x - 5, (Math.max(startY, endY)) - 5, 10, 10);
            rec[7] = new Rectangle(x - 5, y1 - 5, 10, 10);

            if (showTip) {
                g.setColor(Color.CYAN);
                g.fillRect(p.x, p.y, 235, 20);
                g.setColor(Color.RED);
                g.drawRect(p.x, p.y, 235, 20);
                g.setColor(Color.BLACK);
                g.drawString("按住鼠标不放选择截图,双击完成截图", p.x + 10, p.y + 15);
            }
        }

        /**
         * 根据东南西北等八个方向决定选中的要修改的X和Y的座标
         *
         * @param state 状态
         */
        private void initSelect(States state) {
            switch (state) {
                case EAST:
                    currentX = (endX > startX ? END_X : START_X);
                    currentY = 0;
                    break;
                case WEST:
                    currentX = (endX > startX ? START_X : END_X);
                    currentY = 0;
                    break;
                case NORTH:
                    currentX = 0;
                    currentY = (startY > endY ? END_Y : START_Y);
                    break;
                case SOUTH:
                    currentX = 0;
                    currentY = (startY > endY ? START_Y : END_Y);
                    break;
                case NORTH_EAST:
                    currentY = (startY > endY ? END_Y : START_Y);
                    currentX = (endX > startX ? END_X : START_X);
                    break;
                case NORTH_WEST:
                    currentY = (startY > endY ? END_Y : START_Y);
                    currentX = (endX > startX ? START_X : END_X);
                    break;
                case SOUTH_EAST:
                    currentY = (startY > endY ? START_Y : END_Y);
                    currentX = (endX > startX ? END_X : START_X);
                    break;
                case SOUTH_WEST:
                    currentY = (startY > endY ? START_Y : END_Y);
                    currentX = (endX > startX ? START_X : END_X);
                    break;
                case DEFAULT:
                default:
                    currentX = 0;
                    currentY = 0;
                    break;
            }
        }

        /**
         * 鼠标移动对象
         *
         * @param me 事件对象
         */
        @Override
        public void mouseMoved(MouseEvent me) {
            doMouseMoved(me);
            initSelect(current);
            if (showTip) {
                p = me.getPoint();
                repaint();
            }
        }

        /**
         * 处理鼠标移动,是为了每次都能初始化一下所要选择的区域
         *
         * @param me 鼠标事件对象
         */
        private void doMouseMoved(MouseEvent me) {
            if (select.contains(me.getPoint())) {
                this.setCursor(new Cursor(Cursor.MOVE_CURSOR));
                current = States.MOVE;
            } else {
                States[] st = States.values();
                for (int i = 0; i < rec.length; i++) {
                    if (rec[i].contains(me.getPoint())) {
                        current = st[i];
                        this.setCursor(st[i].getCursor());
                        return;
                    }
                }
                this.setCursor(cs);
                current = States.DEFAULT;
            }

        }

        @Override
        public void mouseExited(MouseEvent me) {
        }

        @Override
        public void mouseEntered(MouseEvent me) {
        }

        /**
         * 鼠标拖拽对象
         *
         * @param me 事件对象
         */
        @Override
        public void mouseDragged(MouseEvent me) {
            int x = me.getX();
            int y = me.getY();
            // 分别处理一系列的（光标）状态（枚举值）
            if (current == States.MOVE) {
                startX += (x - tempX);
                startY += (y - tempY);
                endX += (x - tempX);
                endY += (y - tempY);
                tempX = x;
                tempY = y;
            } else if (current == States.EAST || current == States.WEST) {
                if (currentX == START_X) {
                    startX += (x - tempX);
                    tempX = x;
                } else {
                    endX += (x - tempX);
                    tempX = x;
                }
            } else if (current == States.NORTH || current == States.SOUTH) {
                if (currentY == START_Y) {
                    startY += (y - tempY);
                    tempY = y;
                } else {
                    endY += (y - tempY);
                    tempY = y;
                }
            } else if (current == States.NORTH_EAST || current == States.SOUTH_EAST || current == States.SOUTH_WEST) {
                if (currentY == START_Y) {
                    startY += (y - tempY);
                    tempY = y;
                } else {
                    endY += (y - tempY);
                    tempY = y;
                }
                if (currentX == START_X) {
                    startX += (x - tempX);
                    tempX = x;
                } else {
                    endX += (x - tempX);
                    tempX = x;
                }
            } else {
                startX = tempX;
                startY = tempY;
                endX = me.getX();
                endY = me.getY();
            }
            this.repaint();
        }


        /**
         * 鼠标按压事件
         *
         * @param me 事件对象
         */
        @Override
        public void mousePressed(MouseEvent me) {
            showTip = false;
            tempX = me.getX();
            tempY = me.getY();
        }


        /**
         * 鼠标释放事件
         *
         * @param me 事件对象
         */
        @Override
        public void mouseReleased(MouseEvent me) {
            // 鼠标右键
            if (me.isPopupTrigger()) {
                if (current == States.MOVE) {
                    showTip = true;
                    p = me.getPoint();
                    startX = 0;
                    startY = 0;
                    endX = 0;
                    endY = 0;
                    repaint();
                } else {
                    jf.dispose();
                    updates();
                }
            }
        }


        /**
         * 鼠标点击事件
         *
         * @param me 事件
         */
        @Override
        public void mouseClicked(MouseEvent me) {
            // 双击左键触发事件
            if (me.getClickCount() == 2 && select.contains(me.getPoint())) {
                if (select.x + select.width < this.getWidth() && select.y + select.height < this.getHeight()) {
                    get = bi.getSubimage(select.x, select.y, select.width, select.height);
                    jf.dispose();
                    updates();
                    return;
                }

                int wid = select.width, het = select.height;
                if (select.x + select.width >= this.getWidth()) {
                    wid = this.getWidth() - select.x;
                }
                if (select.y + select.height >= this.getHeight()) {
                    het = this.getHeight() - select.y;
                }
                get = bi.getSubimage(select.x, select.y, wid, het);
                jf.dispose();
                updates();
            }
        }

    }
    
}
```

```java
/**
 * 截屏方向状态 东西南北
 * @author whitepure
 */
public enum States {

    NORTH_WEST(new Cursor(Cursor.NW_RESIZE_CURSOR)),

    NORTH(new Cursor(Cursor.N_RESIZE_CURSOR)),

    NORTH_EAST(new Cursor(Cursor.NE_RESIZE_CURSOR)),

    EAST(new Cursor(Cursor.E_RESIZE_CURSOR)),

    SOUTH_EAST(new Cursor(Cursor.SE_RESIZE_CURSOR)),

    SOUTH(new Cursor(Cursor.S_RESIZE_CURSOR)),

    SOUTH_WEST(new Cursor(Cursor.SW_RESIZE_CURSOR)),

    WEST(new Cursor(Cursor.W_RESIZE_CURSOR)),

    MOVE(new Cursor(Cursor.MOVE_CURSOR)),

    DEFAULT(new Cursor(Cursor.DEFAULT_CURSOR));

    private Cursor cs;

    States(Cursor cs) {
        this.cs = cs;
    }

    public Cursor getCursor() {
        return cs;
    }
}
```

```java
public class CutScreenMainStarter {

    public static void main(String[] args) {
        SwingUtilities.invokeLater(CaptureScreen::new);
    }
}
```

## 文字转二维码
输入文字，生成二维码。[点击下载](/iblog/posts/annex/jar/qr-code.jar)

![Java玩具-004](/iblog/posts/annex/images/readme/Java玩具-004.png)
### 代码
需要依赖第三方类库：[点击下载](/iblog/posts/annex/jar/lib/qrcode.jar)

```java
/**
 * 创建二维码
 *
 */
public class QRCode {


    /**
     * 生成二维码图像
     *
     * @param context 二维码内容
     * @param size   二维码尺寸
     * @return 二维码图像
     */
    public  BufferedImage createPassword(String context, int size) {
        BufferedImage buffer;
        Qrcode qrCodeHandler = new Qrcode();
        qrCodeHandler.setQrcodeErrorCorrect('M');
        qrCodeHandler.setQrcodeEncodeMode('B');
        qrCodeHandler.setQrcodeVersion(size);
        byte[] contextBytes = context.getBytes(StandardCharsets.UTF_8);
        boolean[][] codeOut = qrCodeHandler.calQrcode(contextBytes);

        // 图像的尺寸 都使用一个值生成一个正方形图案
        int imgSize = 67 + 12 * (size - 1);
        buffer = new BufferedImage(imgSize, imgSize, 1);
        Graphics2D gs = buffer.createGraphics();
        gs.setColor(Color.BLACK);
        gs.setBackground(Color.white);
        gs.clearRect(0, 0, imgSize, imgSize);
        int pixOff = 2;

        for (int i = 0; i < codeOut.length; ++i) {
            for (int j = 0; j < codeOut.length; ++j) {
                if (codeOut[i][j]) {
                    gs.fillRect(j * 3 + pixOff, i * 3 + pixOff, 3, 3);
                }
            }
        }
        return buffer;
    }

}
```

```java
public class QRCodeFrame {

    public QRCodeFrame(){
        init();
    }


    private void init(){
        // 一些组件
        JFrame frame = new JFrame("生成二维码");
        JTextField input = new JTextField(13);
        JPanel panel = new JPanel();
        JPanel imgPanel = new JPanel();
        JButton btn = new JButton("生成");
        Border lineBorder = BorderFactory.createLineBorder(Color.gray, 1);
        // 获取光标，使光标一直在文本框内
        input.requestFocus();
        input.setBorder(lineBorder);

        panel.add(input);
        panel.add(btn);

        // 点击按钮执行
        btn.addActionListener(e -> {
            String text = input.getText();
            if (text == null || "".equals(text)){
                return;
            }
            // 刷新imgPanel
            imgPanel.removeAll();
            imgPanel.repaint();

            QRCode qrCode = new QRCode();
            BufferedImage qrCodeImg = qrCode.createPassword(text, 11);

            ImageIcon imageIcon = new ImageIcon(qrCodeImg);
            JLabel label = new JLabel(imageIcon);
            imgPanel.add(label, BorderLayout.CENTER);
            // 刷新imgPanel
            imgPanel.updateUI();
        });

        frame.getContentPane().add(panel, BorderLayout.NORTH);
        frame.getContentPane().add(imgPanel, BorderLayout.SOUTH);
        frame.setLayout(new FlowLayout(FlowLayout.CENTER));
        frame.setBounds(600,250,300,280);
        frame.setVisible(true);
        frame.setAlwaysOnTop(true);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setResizable(false);
    }

}
```

```java
public class QRCodeMainStarter {
    public static void main(String[] args) {
        new QRCodeFrame();
    }
}
```
## 英文翻译器
将英文翻译为中文,仅支持单词、短语翻译，程序默认加载自带的英语字典，如果您想要修改字典可在源代码中进行配置或在程序运行时指定字典路径。[点击下载](/iblog/posts/annex/jar/english-translation.jar)

![Java玩具-005](/iblog/posts/annex/images/readme/Java玩具-005.png)
### 代码
```java
/**
 * 参考：https://www.jb51.net/article/163917.htm 有改动
 * <p>
 * 暂时可翻译单词，需要手动录入词典；暂时不能翻译英文句子需要写一些语法判断，比如动词后面跟名词，倒装句结构等等。
 *
 * @author whitepure
 */
public class EnglishTranslation {

    private Properties pps;

    public EnglishTranslation(String dictPath) {
        loadDict(dictPath);
    }


    /**
     * 加载词典
     *
     * @param dictPath 词典路径
     */
    public void loadDict(String dictPath) {
        if (dictPath == null || "".equals(dictPath) || !(new File(dictPath).exists())) {
            System.out.println("加载词典文件不存在");
            System.exit(0);
            return;
        }
        pps = new Properties();
        // 以字符载入时没有乱码，以字节载入时出现了乱码
        try (FileReader fis = new FileReader(dictPath)) {
            pps.load(fis);
        } catch (Exception ex) {
            ex.printStackTrace(System.out);
            System.out.println("载入词库时出错");
        }
    }

    /**
     * 翻译将待翻译的去词典中去找然后在返回
     *
     * @param data 待翻译的数据
     * @return 翻译后的数据
     */
    public String translation(byte[] data) {
        String srcTxt = new String(data);
        String dstTxt = srcTxt;
        String delim = " ,.!?%$*()\n\t";
        StringTokenizer st = new StringTokenizer(srcTxt, delim, false);
        String sub, lowerSub, newSub;
        while (st.hasMoreTokens()) {
            // 获取待翻译的单词
            sub = st.nextToken();
            // 将单词转化为小写
            lowerSub = sub.toLowerCase();
            // 从词典中寻找中文对应的单词
            newSub = pps.getProperty(lowerSub);
            if (newSub != null) {
                // 只替换第一个，即只替换了当前的字符串，否则容易造成翻译错误，如 china 翻译为 ch我na
                dstTxt = dstTxt.replaceFirst(sub, newSub);
            }
        }
        return dstTxt.replaceAll(" ", "");
    }

}
```

```java
/**
 * GUI翻译组件
 *
 * @author whitepure
 */
public class TranslationFrame {

    private final EnglishTranslation englishTranslation;

    public TranslationFrame(String dictPath){
        englishTranslation = new EnglishTranslation(dictPath);
        init();
    }


    /**
     * 初始化gui组件
     */
    private void init(){
        // 一些组件
        JFrame frame = new JFrame("英语翻译");
        JTextField input = new JTextField(20);
        JPanel panel = new JPanel();
        JButton btn = new JButton("翻译");
        JTextArea textArea = new JTextArea(4,27);
        Border lineBorder = BorderFactory.createLineBorder(Color.gray, 1);
        textArea.setBorder(lineBorder);
        // 获取光标，使光标一直在文本框内
        input.requestFocus();
        input.setBorder(lineBorder);

        panel.add(input);
        panel.add(btn);
        frame.getContentPane().add(panel, BorderLayout.NORTH);
        frame.add(textArea);
        // 点击翻译按钮执行
        btn.addActionListener(e -> {
            String text = input.getText();
            if (text == null || "".equals(text)){
                return;
            }
            String translationText = englishTranslation.translation(text.getBytes());
            System.out.printf("%s 译为 %s \n",text,translationText);
            textArea.setText(translationText);
        });

        frame.setLayout(new FlowLayout(FlowLayout.CENTER));
        frame.setBounds(600,250,355,160);
        frame.setVisible(true);
        frame.setAlwaysOnTop(true);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setResizable(false);
    }

}
```

```java
public class TranslationMainStarter {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String path = null;
        System.out.println("请输入字典的全路径，例如：/Users/whitepure/IdeaProjects/gadget/out/production/english-translation/io/github/whitepure/dict.txt");
        if(scanner.hasNext()){
            String dictPath = scanner.next();
            System.out.println("键盘输入的内容是："+ dictPath);
            path = dictPath;
        }
        if (path == null || "".equals(path)){
            path = new TranslationMainStarter().getDefaultLoadPath();
        }
        new TranslationFrame(path);
    }

    /**
     * 加载词典文件加载到内存
     *
     * @return 词典路径
     */
    private String getDefaultLoadPath() {
        final String dictPath = new File(Objects.requireNonNull(this.getClass().getResource("")).getPath())
                + System.getProperty("file.separator")
                + "dict.txt";
        System.out.println("当前词典加载路径：" + dictPath);
        return dictPath;
    }
}
```

字典文件dict.txt
```txt
i=我
me=我
myself=我
he=他
him=他
she=她
it=它
they=它们
us=我们
our=我们
we=我们
her=她的
his=他的
them=他们
you=你
thee=你
thou=你
your=你的
my=我的
and=并且
hello=你好
world=世界
love=爱
china=中国
chinese=中国人
```
## 提色器
按住alt（macOS用户按住option）鼠标滑动即可获取当前位置颜色。[点击下载](/iblog/posts/annex/jar/english-translation.jar)

![Java玩具-006](/iblog/posts/annex/images/readme/Java玩具-006.png)
### 代码
```java
public class ExtracterFrame {


    public ExtracterFrame() {
        init();
    }


    /**
     * 初始化
     */
    private void init() {
        // 窗口组件
        JFrame frame = new JFrame("提色器");
        JPanel rgbPanel = new JPanel();
        JPanel colorPanel = new JPanel();

        // rgb 组件
        JLabel labelR = new JLabel("R：");
        JLabel labelG = new JLabel("G：");
        JLabel labelB = new JLabel("B：");
        JTextField txtR = new JTextField(3);
        JTextField txtG = new JTextField(3);
        JTextField txtB = new JTextField(3);

        rgbPanel.add(labelR);
        rgbPanel.add(txtR);
        rgbPanel.add(labelG);
        rgbPanel.add(txtG);
        rgbPanel.add(labelB);
        rgbPanel.add(txtB);

        // 展示颜色组件
        JLabel labelHex = new JLabel("16进制:");
        JTextField txtHex = new JTextField(8);
        JTextField colorTxt = new JTextField(5);
        colorTxt.setBackground(Color.BLACK);

        colorPanel.add(labelHex);
        colorPanel.add(txtHex);
        colorPanel.add(colorTxt);


        class ExtractKeyListener implements KeyListener {
            @Override
            public void keyTyped(KeyEvent e) {
            }

            @Override
            public void keyPressed(KeyEvent e) {
            }

            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getKeyCode() == 18) {
                    Robot robot;
                    try {
                        robot = new Robot();
                    } catch (AWTException exception) {
                        System.out.println("提取颜色失败");
                        exception.printStackTrace();
                        return;
                    }
                    Point point = MouseInfo.getPointerInfo().getLocation();
                    Color pixelColor = robot.getPixelColor(point.x, point.y);

                    int red = pixelColor.getRed();
                    int green = pixelColor.getGreen();
                    int blue = pixelColor.getBlue();

                    txtR.setText(String.valueOf(red));
                    txtG.setText(String.valueOf(green));
                    txtB.setText(String.valueOf(blue));

                    colorTxt.setBackground(pixelColor);
                    txtHex.setText("#" + Integer.toHexString(red) + Integer.toHexString(green) + Integer.toHexString(blue));
                }
            }
        }


        // 监听键盘事件
        ExtractKeyListener extractKeyListener = new ExtractKeyListener();
        txtR.addKeyListener(extractKeyListener);
        txtG.addKeyListener(extractKeyListener);
        txtB.addKeyListener(extractKeyListener);
        colorTxt.addKeyListener(extractKeyListener);


        // 添加panel
        frame.getContentPane().add(rgbPanel, BorderLayout.NORTH);
        frame.getContentPane().add(colorPanel, BorderLayout.SOUTH);

        frame.setLayout(new FlowLayout(FlowLayout.CENTER));
        frame.setBounds(600, 250, 250, 120);
        frame.setVisible(true);
        frame.setAlwaysOnTop(true);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setResizable(false);
    }

}
```

```java
public class ExtractColorMainStarter {
    public static void main(String[] args) {
        new ExtracterFrame();
    }
}
```

## 图片水印生成器
加载图片，输入水印内容，在加载图片的右下会生成红色水印。[点击下载](/iblog/posts/annex/jar/img-watermarking.jar)

![Java玩具-007](/iblog/posts/annex/images/readme/Java玩具-007.png)
### 代码
```java
public class ImgWatermarking {


    /**
     * 给图片添加水印文字、可设置水印文字的旋转角度
     *
     * @param logoText   水印文本
     * @param srcImgPath 原图片路径
     * @param degree     旋转角度，如果不旋转设置为 null
     */
    public BufferedImage createImgWatermarking(
            String logoText,
            String srcImgPath,
            Integer degree,
            Color color,
            Font font,
            float alpha
    ) {
        alpha = alpha == 0 ? 0.5f : alpha;
        font = font == null ? new Font("微软雅黑", Font.PLAIN, 35) : font;
        color = color == null ? Color.red : color;

        System.out.println("生成图片=》图片路径：" + srcImgPath + " 水印内容=》" + logoText);

        Image srcImg;
        try {
            srcImg = ImageIO.read(new File(srcImgPath));
        } catch (IOException e) {
            System.out.println("读取文件失败");
            e.printStackTrace();
            return null;
        }
        int width = srcImg.getWidth(null);
        int height = srcImg.getHeight(null);
        BufferedImage buffImg = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

        // 拿到画笔对象
        Graphics2D g = buffImg.createGraphics();

        // 设置水印
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(srcImg.getScaledInstance(width, height, Image.SCALE_SMOOTH), 0, 0, null);

        // 设置水印旋转
        if (null != degree) {
            g.rotate(Math.toRadians(degree), (buffImg.getWidth() >> 1), (buffImg.getHeight() >> 1));
        }

        // 设置水印
        g.setColor(color);
        g.setFont(font);
        g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP, alpha));
        int x = width - logoText.length() * font.getSize();
        int y = height - font.getSize() * 2;
        g.drawString(logoText, Math.max(x, 0), Math.max(y, 0));
        g.dispose();
        return buffImg;
    }

}
```

```java
/**
 * @author whitepure
 */
public class WatermarkingFrame {

    public WatermarkingFrame() {
        init();
    }

    /**
     * 初始化
     */
    private void init() {
        // 一些组件
        JFrame frame = new JFrame("生成水印");
        JTextField input = new JTextField(13);
        JPanel panel = new JPanel();
        JPanel imgPanel = new JPanel();
        JButton createBtn = new JButton("生成");
        JButton loadImgBtn = new JButton("加载图片");
        JButton saveAs = new JButton("另存为");
        Border lineBorder = BorderFactory.createLineBorder(Color.gray, 1);
        // 获取光标，使光标一直在文本框内
        input.requestFocus();
        input.setBorder(lineBorder);

        panel.add(input);
        panel.add(saveAs);
        panel.add(createBtn);
        panel.add(loadImgBtn);

        // 图片路径
        String[] imgPath = new String[1];
        // 用于另存为的图片
        final BufferedImage[] waterMarkingImg = new BufferedImage[1];
        // 屏幕的尺寸
        Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();

        // 点击按钮加载图片
        loadImgBtn.addActionListener(e -> {
            JFileChooser jfc = new JFileChooser(FileSystemView.getFileSystemView().getHomeDirectory());
            jfc.setDialogTitle("选择图片");
            jfc.setAcceptAllFileFilterUsed(false);
            FileNameExtensionFilter filter = new FileNameExtensionFilter("PNG and JPG images", "png", "jpg");
            jfc.addChoosableFileFilter(filter);

            int returnValue = jfc.showOpenDialog(null);
            // 获取图片路径
            if (returnValue == JFileChooser.APPROVE_OPTION) {
                String path = jfc.getSelectedFile().getPath();
                imgPath[0] = path;
            }

            String path = jfc.getSelectedFile().getPath();
            File sourceImage = new File(path);
            BufferedImage image;
            try {
                image = ImageIO.read(sourceImage);
            } catch (IOException ex) {
                System.out.println("图片加载失败");
                ex.printStackTrace();
                JOptionPane.showMessageDialog(panel, "图片加载失败," + ex.getMessage(), "提示", JOptionPane.PLAIN_MESSAGE);
                return;
            }
            // 刷新imgPanel
            imgPanel.removeAll();
            imgPanel.repaint();

            // 将图片放入到数组中，用于另存为保存该图片
            waterMarkingImg[0] = image;
            int width = image.getWidth(null);
            int height = image.getHeight(null);

            ImageIcon imageIcon = new ImageIcon(image);
            imageIcon.setImage(imageIcon.getImage().getScaledInstance(width >> 1, height >> 1, Image.SCALE_DEFAULT));
            JLabel label = new JLabel(imageIcon);

            imgPanel.add(label, BorderLayout.CENTER);
            // 刷新imgPanel
            imgPanel.updateUI();
            frame.setBounds(((screenSize.width - (width >> 1)) >> 1) , ((screenSize.height - (height >> 1)) >> 2), Math.max((width >> 1), 450), (height >> 1) + 90);
        });

        // 点击按钮生成水印
        createBtn.addActionListener(e -> {
            String text = input.getText();
            if (text == null || "".equals(text)) {
                System.out.println("水印内容为空");
                JOptionPane.showMessageDialog(panel, "水印内容为空", "提示", JOptionPane.WARNING_MESSAGE);
                return;
            }
            if (imgPath[0] == null) {
                JOptionPane.showMessageDialog(panel, "未加载图片", "提示", JOptionPane.WARNING_MESSAGE);
                System.out.println("未加载图片");
                return;
            }
            BufferedImage imgWatermarking = new ImgWatermarking().createImgWatermarking(text, imgPath[0], null, null, null, 0);

            // 刷新imgPanel
            imgPanel.removeAll();
            imgPanel.repaint();

            // 保存图片用于另存为
            waterMarkingImg[0] = imgWatermarking;
            int width = imgWatermarking.getWidth(null);
            int height = imgWatermarking.getHeight(null);

            ImageIcon imageIcon = new ImageIcon(imgWatermarking);
            imageIcon.setImage(imageIcon.getImage().getScaledInstance(width >> 1, height >> 1, Image.SCALE_DEFAULT));
            JLabel label = new JLabel(imageIcon);

            imgPanel.add(label, BorderLayout.CENTER);
            // 刷新imgPanel
            imgPanel.updateUI();
        });

        // 点击另存为
        saveAs.addActionListener(e -> {
            BufferedImage image = waterMarkingImg[0];
            if (image == null) {
                JOptionPane.showMessageDialog(panel, "未加载图片", "提示", JOptionPane.WARNING_MESSAGE);
                return;
            }

            FileDialog fd = new FileDialog(frame, "另存为", FileDialog.SAVE);
            fd.setVisible(true);
            // 获取路径
            String directory = fd.getDirectory();
            // 获取文件名
            String fileName = fd.getFile();
            try (OutputStream out = new FileOutputStream(directory + fileName);) {
                // 将图片输出到文件
                ImageIO.write(image, "jpg", out);
            } catch (IOException ex) {
                System.out.println("另存为图片失败");
                ex.printStackTrace();
                JOptionPane.showMessageDialog(panel, "另存为图片失败," + ex.getMessage(), "提示", JOptionPane.PLAIN_MESSAGE);
            }
        });

        frame.getContentPane().add(panel, BorderLayout.NORTH);
        frame.getContentPane().add(imgPanel, BorderLayout.SOUTH);
        frame.setLayout(new FlowLayout(FlowLayout.CENTER));
        frame.setBounds(screenSize.width >> 1, screenSize.height >> 2, 450, 80);
        frame.setVisible(true);
        frame.setAlwaysOnTop(true);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setResizable(false);
    }

}
```

```java
public class ImgWatermarkingMainStarter {
    public static void main(String[] args) {
        new WatermarkingFrame();
    }
}
```

## huffman压缩
采用huffman算法对文件进行无损压缩，目前仅支持压缩单个文件，压缩好的文件以`.huf`后缀结尾,会与被压缩文件放在相同目录下。[点击下载](/iblog/posts/annex/jar/huffman-zip.jar)

![Java玩具-008](/iblog/posts/annex/images/readme/Java玩具-008.png)
### 代码
```java
public abstract class HuffmanCode {


    /**
     * 存放 huffman 编码表
     */
    private final Map<Byte, String> huffmanCodes = new HashMap<>();


    public Map<Byte, String> getHuffmanCodesTab() {
        return huffmanCodes;
    }

    /**
     * 将文件解码或将文件压缩
     *
     * @param zipFile 原文件
     * @param dstFile 目标文件
     */
    public abstract void zipOrUnZip(String zipFile, String dstFile);

    /**
     * 生成 huffman 编码 压缩
     *
     * @param bytes 将传入的文件转成字节传入
     * @return 将传入字节转换为huffman压缩后的字节数组
     */
    public byte[] encode(byte[] bytes) {
        List<Node> nodes = buildHuffmanNodes(bytes);
        Node huffmanTreeRoot = buildHuffmanTree(nodes);
        Map<Byte, String> huffmanCodes = buildHuffmanCodeTab(huffmanTreeRoot);
        return zip(bytes, huffmanCodes);
    }

    /**
     * 将 huffman编码解码，解压缩
     *
     * @param huffmanCodes huffman编码表
     * @param huffmanBytes 待解码的huffman编码（byte数组类型）
     * @return 解码后的
     */
    public byte[] decode(Map<Byte, String> huffmanCodes, byte[] huffmanBytes) {
        StringBuilder stringBuilder = new StringBuilder();

        // 将byte数组转成二进制的字符串
        for (int i = 0; i < huffmanBytes.length - 1; i++) {
            byte b = huffmanBytes[i];
            String strToAppend = byteToBitString(b);
            // 判断是不是最后一个字节
            boolean isLastByte = (i == huffmanBytes.length - 2);
            if (isLastByte) {
                // 得到最后一个字节的有效位数
                byte validBits = huffmanBytes[huffmanBytes.length - 1];
                strToAppend = strToAppend.substring(0, validBits);
            }
            stringBuilder.append(strToAppend);
        }

        // 将huffman编码key，val反转
        Map<String, Byte> map = new HashMap<>();
        huffmanCodes.forEach((key, value) -> map.put(value, key));

        // 创建要给集合，存放byte
        List<Byte> list = new ArrayList<>();
        for (int i = 0; i < stringBuilder.length(); ) {
            int count = 1;
            boolean flag = true;
            Byte b = null;

            // 根据huffman编码表来匹配Huffman编码
            while (flag) {
                String key = stringBuilder.substring(i, i + count);
                b = map.get(key);
                if (b == null) {
                    // 没有匹配到
                    count++;
                } else {
                    // 匹配到
                    flag = false;
                }
            }
            list.add(b);
            i += count;
        }
        byte[] b = new byte[list.size()];
        IntStream.range(0, b.length).forEach(i -> b[i] = list.get(i));
        return b;
    }

    /**
     * 计算传入字节数组中每个字符出现的次数
     * 在Node对象中添加对应的值
     *
     * @param bytes 传入字节数组
     * @return list
     */
    private List<Node> buildHuffmanNodes(byte[] bytes) {
        ArrayList<Node> nodes = new ArrayList<>();
        // 利用map记录集合中元素出现的次数
        Map<Byte, Integer> counts = new HashMap<>();
        for (byte b : bytes) {
            counts.merge(b, 1, Integer::sum);
        }
        // 把每一个键值对转成一个Node 对象，并加入到nodes集合
        counts.forEach((key, value) -> nodes.add(new Node(key, value)));
        return nodes;
    }

    /**
     * 构建Huffman树
     *
     * @param nodes 传入统计好的 每个字符出现的次数,即{@method buildHuffmanNodes}方法执行完毕
     * @return 构建好Huffman的根结点
     */
    private Node buildHuffmanTree(List<Node> nodes) {
        while (nodes.size() > 1) {
            // 排序, 从小到大
            Collections.sort(nodes);
            // 取出第一颗最小的二叉树
            Node leftNode = nodes.get(0);
            // 取出第二颗最小的二叉树
            Node rightNode = nodes.get(1);
            // 创建一颗新的二叉树,它的根节点 没有data, 只有权值
            Node parent = new Node(null, leftNode.weight + rightNode.weight);
            parent.left = leftNode;
            parent.right = rightNode;

            // 将已经处理的两颗二叉树从nodes删除
            nodes.remove(leftNode);
            nodes.remove(rightNode);
            // 将新的二叉树，加入到nodes
            nodes.add(parent);
        }
        // nodes 最后的结点，就是赫夫曼树的根结点
        return nodes.get(0);
    }

    /**
     * 构建huffman编码表
     *
     * @param root huffman root结点
     * @return 返回一个Huffman编码表
     */
    private Map<Byte, String> buildHuffmanCodeTab(Node root) {
        if (root == null) {
            return null;
        }
        // 处理root的左子树
        buildHuffmanCodeTab(root.left, "0", new StringBuilder());
        // 处理root的右子树
        buildHuffmanCodeTab(root.right, "1", new StringBuilder());
        return huffmanCodes;
    }

    private void buildHuffmanCodeTab(Node node, String code, StringBuilder stringBuilder) {
        StringBuilder curNodeCode = new StringBuilder(stringBuilder);
        curNodeCode.append(code);
        if (node == null) {
            return;
        }
        // 判断当前node 是叶子结点还是非叶子结点，如果 node.data == null 为非叶子结点
        if (node.data == null) {
            // 向左递归
            buildHuffmanCodeTab(node.left, "0", curNodeCode);
            // 向右递归
            buildHuffmanCodeTab(node.right, "1", curNodeCode);
        } else {
            // 表示找到某个叶子结点的最后
            huffmanCodes.put(node.data, curNodeCode.toString());
        }
    }

    // 压缩传入字节（将传入字符串转成字节类型）将待压缩字节转换为字节数组
    private byte[] zip(byte[] bytes, Map<Byte, String> huffmanCodes) {
        // 利用 huffmanCodes 将 bytes 转成 赫夫曼编码对应的字符串
        StringBuilder stringBuilder = new StringBuilder();
        // 遍历bytes 数组
        for (byte b : bytes) {
            stringBuilder.append(huffmanCodes.get(b));
        }

        // 统计返回 byte[] huffmanCodeBytes 长度
        int len;
        // 等同于 int len = (stringBuilder.length() + 7) / 8;
        byte countToEight = (byte) (stringBuilder.length() & 7);
        if (countToEight == 0) {
            len = stringBuilder.length() >> 3;
        } else {
            len = (stringBuilder.length() >> 3) + 1;
            // 后面补零
            for (int i = countToEight; i < 8; i++) {
                stringBuilder.append("0");
            }
        }

        // 创建 存储压缩后的 byte数组，huffmanCodeBytes[len]记录赫夫曼编码最后一个字节的有效位数
        byte[] huffmanCodeBytes = new byte[len + 1];
        huffmanCodeBytes[len] = countToEight;
        int index = 0;
        // 因为是每8位对应一个byte,所以步长 +8
        for (int i = 0; i < stringBuilder.length(); i += 8) {
            String strByte;
            strByte = stringBuilder.substring(i, i + 8);
            // 将strByte 转成一个byte,放入到 huffmanCodeBytes
            huffmanCodeBytes[index] = (byte) Integer.parseInt(strByte, 2);
            index++;
        }
        return huffmanCodeBytes;
    }

    /**
     * 将 byte 转换为对应的字符串 解码时要用
     *
     * @param b 待处理的字节
     * @return 将字节转换成二进制字符串
     */
    private String byteToBitString(byte b) {
        int temp = b;
        // 如果是正数我们需要将高位补零
        temp |= 0x100;
        // 转换为二进制字符串，正数：高位补 0 即可，然后截取低八位即可；负数直接截取低八位即可
        // 负数在计算机内存储的是补码，补码转原码：先 -1 ，再取反
        String binaryStr = Integer.toBinaryString(temp);
        return binaryStr.substring(binaryStr.length() - 8);
    }


    /**
     * huffman 树的结点
     */
    public static class Node implements Comparable<Node> {
        Byte data;
        int weight;
        Node left;
        Node right;

        public Node(Byte data, int weight) {
            this.data = data;
            this.weight = weight;
        }

        @Override
        public int compareTo(Node o) {
            // 从小到大排序
            return this.weight - o.weight;
        }

        @Override
        public String toString() {
            return "Node [data = " + data + " weight=" + weight + "]";
        }
    }
}
```

```java
public class HuffmanUnZip extends HuffmanCode {


    @Override
    public void zipOrUnZip(String zipFile, String dstFile) {
        // 定义文件输入流
        InputStream is = null;
        // 定义一个对象输入流
        ObjectInputStream ois = null;
        // 定义文件的输出流
        OutputStream os = null;
        try {
            // 创建文件输入流
            is = new FileInputStream(zipFile);
            // 创建一个和 is关联的对象输入流
            ois = new ObjectInputStream(is);
            // 读取byte数组 huffmanBytes
            byte[] huffmanBytes = (byte[]) ois.readObject();
            // 读取赫夫曼编码表
            Map<Byte, String> huffmanCodes = (Map<Byte, String>) ois.readObject();
            // 解码
            byte[] bytes = decode(huffmanCodes, huffmanBytes);
            // 将bytes 数组写入到目标文件
            os = new FileOutputStream(dstFile);
            // 写数据到 dstFile 文件
            os.write(bytes);
        } catch (Exception e) {
            // TODO: handle exception
            System.out.println(e.getMessage());
        } finally {
            try {
                if (os != null) {
                    os.close();
                }
                if (ois != null) {
                    ois.close();
                }
                if (is != null) {
                    is.close();
                }
            } catch (Exception e2) {
                // TODO: handle exception
                System.out.println(e2.getMessage());
            }

        }
    }
}
```

```java
public class HuffmanZip extends HuffmanCode{

    @Override
    public void zipOrUnZip(String srcFile, String dstFile){
        // 创建输出流
        OutputStream os = null;
        ObjectOutputStream oos = null;
        // 创建文件的输入流
        FileInputStream is = null;
        try {
            // 创建文件的输入流
            is = new FileInputStream(srcFile);
            // 创建一个和源文件大小一样的byte[]
            byte[] b = new byte[is.available()];
            // 读取文件
            is.read(b);
            // 直接对源文件压缩
            byte[] huffmanBytes = encode(b);
            // 创建文件的输出流, 存放压缩文件
            os = new FileOutputStream(dstFile);
            // 创建一个和文件输出流关联的ObjectOutputStream
            oos = new ObjectOutputStream(os);
            // 把 赫夫曼编码后的字节数组写入压缩文件
            oos.writeObject(huffmanBytes);
            // 这里我们以对象流的方式写入 赫夫曼编码，是为了以后我们恢复源文件时使用
            // 注意一定要把赫夫曼编码 写入压缩文件
            oos.writeObject(getHuffmanCodesTab());

        } catch (Exception e) {
            throw new RuntimeException("使用huffman编码压缩异常！", e);
        } finally {
            try {
                if (is != null) {
                    is.close();
                }
                if (oos != null) {
                    oos.close();
                }
                if (os != null) {
                    os.close();
                }
            } catch (Exception e) {
                // TODO: handle exception
                System.out.println(e.getMessage());
            }
        }
    }

}
```

```java
public class HuffmanFrame {

    /**
     * 当前屏幕的宽
     */
    private final int WINDOW_WIDTH;

    /**
     * 当前屏幕的高
     */
    private final int WINDOW_HEIGHT;

    public HuffmanFrame() {
        Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
        WINDOW_WIDTH = screenSize.width;
        WINDOW_HEIGHT = screenSize.height;
    }


    /**
     * 初始化huffman窗口
     *
     * @param width  宽
     * @param height 高
     */
    public void init(int width, int height) {
        Frame frame = new Frame();
        frame.setTitle("huffman压缩");
        // 设置窗口可见
        frame.setVisible(true);
        // 禁止调整窗口大小
        frame.setResizable(false);
        // 设置窗口大小
        frame.setSize(width, height);
        // 设置窗口出现在屏幕的位置
        frame.setLocation((WINDOW_WIDTH - width) >> 1, (WINDOW_HEIGHT - height) >> 2);
        FlowLayout flowLayout = new FlowLayout();
        //设置对齐方式
        flowLayout.setAlignment(FlowLayout.CENTER);
        // 设置流式布局
        frame.setLayout(flowLayout);
        // 设置按钮
        Button zipBtn = new Button("压缩");
        Button unZipBtn = new Button("解压缩");
        frame.add(zipBtn, BorderLayout.CENTER);
        frame.add(unZipBtn, BorderLayout.CENTER);
        listenerBtnOfFile(zipBtn, new HuffmanZip(),frame);
        listenerBtnOfFile(unZipBtn, new HuffmanUnZip(),frame);
        //关闭窗口
        frame.addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                System.exit(0);
            }
        });
    }


    /**
     * 监听点击按钮触发事件，解压缩或压缩
     *
     * @param btn         按钮对象
     * @param huffmanCode 压缩或解压缩对象
     */
    private void listenerBtnOfFile(Button btn, HuffmanCode huffmanCode,Frame frame) {
        btn.addActionListener(e -> {
            FileDialog openDialog = new FileDialog(frame, "打开文件", FileDialog.LOAD);
            openDialog.setVisible(true);

            String dirName = openDialog.getDirectory();
            String fileName = openDialog.getFile();
            String src = dirName + fileName;
            if (dirName == null || fileName == null) {
                return;
            }

            // 压缩或解压缩后 弹框提示
            JDialog jDialog = new JDialog();
            jDialog.setSize(200, 200);
            jDialog.setLocation((WINDOW_WIDTH - 200) / 2, (WINDOW_HEIGHT - 200) / 3);
            jDialog.setVisible(true);
            jDialog.setTitle("提示");
            jDialog.setLayout(new FlowLayout());
            JLabel jLabel = new JLabel();
            String suffix = ".huf";
            String dist;

            // 如果文件包含了后缀则需要解压缩文件 不给原文件添加后缀
            if (src.contains(suffix)) {
                dist = src.substring(0, src.length() - 4);
            } else {
                // 如果不包含压缩后缀 && 传递解压缩类型则无法解压
                if (huffmanCode instanceof HuffmanUnZip) {
                    jLabel.setText("不包含" + suffix + "无法解压！");
                    jDialog.add(jLabel);
                    return;
                }
                dist = src + suffix;
            }
            System.out.printf("原文件：%s \t 目标文件：%s \n", src, dist);

            try {
                huffmanCode.zipOrUnZip(src, dist);
                jLabel.setText("操作成功！");
            } catch (Exception exception) {
                jLabel.setText("操作异常！" + exception.getMessage());
            }
            jDialog.add(jLabel);
        });
    }

}
```

```java
public class HuffmanMainStarter {
    public static void main(String[] args) {
        new HuffmanFrame().init(200,70);
    }
}
```
