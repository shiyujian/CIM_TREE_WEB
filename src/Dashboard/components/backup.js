/**
 * Created by tinybear on 17/6/5.
 */


<Modal title="文件预览" visible={this.state.previewVisible}
       onOk={this.previewModal.bind(this)} onCancel={this.previewModal.bind(this)}
       width={1000}>
    <Spin spinning={this.state.loading} tip="数据加载中，请稍等...">
        {
            (this.state.previewType == 'office') ?
                <iframe src={`${previewWord_API}${this.state.previewUrl}`}
                        width="100%" height="400px" frameBorder="0"></iframe>
                :
                <iframe className="file-pop-frame"
                        src={`/pdfjs/web/viewer.html?file=${this.state.previewUrl}`}
                        width="100%" height="400px" scrolling="no" frameBorder="0"></iframe>
        }
    </Spin>
</Modal>