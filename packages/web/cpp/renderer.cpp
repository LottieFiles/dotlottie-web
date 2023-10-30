#include <thorvg.h>
#include <emscripten/bind.h>

using namespace emscripten;
using namespace std;
using namespace tvg;

static const char *NoError = "None";

class __attribute__((visibility("default"))) Renderer
{

public:
    ~Renderer()
    {
        free(buffer);
        Initializer::term(CanvasEngine::Sw);
    }

    static unique_ptr<Renderer> create()
    {
        return unique_ptr<Renderer>(new Renderer());
    }

    string error()
    {
        return errorMsg;
    }

    bool load(string data, int width, int height)
    {

        errorMsg = NoError;

        if (!canvas)
        {
            errorMsg = "Invalid canvas";
            return false;
        }

        if (data.empty())
        {
            errorMsg = "Invalid data";
            return false;
        }

        canvas->clear(true);

        animation = Animation::gen();

        if (animation->picture()->load(data.c_str(), data.size(), "lottie", false) != Result::Success)
        {
            errorMsg = "load() fail";
            return false;
        }

        animation->picture()->size(&psize[0], &psize[1]);

        /* need to reset size to calculate scale in Picture.size internally before calling resize() */
        this->width = 0;
        this->height = 0;

        resize(width, height);

        std::unique_ptr<Paint> picturePaint(animation->picture());

        if (canvas->push(std::move(picturePaint)) != Result::Success)
        {
            errorMsg = "push() fail";
            return false;
        }

        updated = true;

        return true;
    }

    bool update()
    {
        if (!updated)
            return true;

        errorMsg = NoError;

        if (canvas->update() != Result::Success)
        {
            errorMsg = "update() fail";
            return false;
        }

        return true;
    }

    val render()
    {
        errorMsg = NoError;

        if (!canvas || !animation)
        {
            errorMsg = "Invalid canvas or animation";
            return val(typed_memory_view<uint8_t>(0, nullptr));
        }

        if (!updated)
        {

            return val(typed_memory_view(width * height * 4, buffer));
        }

        if (canvas->draw() != Result::Success)
        {
            errorMsg = "draw() fail";
            return val(typed_memory_view<uint8_t>(0, nullptr));
        }

        canvas->sync();

        updated = false;

        return val(typed_memory_view(width * height * 4, buffer));
    }

    val size()
    {
        return val(typed_memory_view(2, psize));
    }

    val duration()
    {
        if (!canvas || !animation)
            return val(0);
        return val(animation->duration());
    }

    val totalFrame()
    {
        if (!canvas || !animation)
            return val(0);
        return val(animation->totalFrame());
    }

    bool frame(float no)
    {
        if (!canvas || !animation)
            return false;
        if (animation->frame(no) != Result::Success)
        {
            errorMsg = "frame() fail";
            return false;
        }

        updated = true;

        return true;
    }

    void resize(int width, int height)
    {
        if (!canvas || !animation)
            return;
        if (this->width == width && this->height == height)
            return;

        this->width = width;
        this->height = height;

        free(buffer);
        buffer = (uint8_t *)malloc(width * height * sizeof(uint32_t));
        canvas->target((uint32_t *)buffer, width, width, height, SwCanvas::ABGR8888S);

        float scale;
        float shiftX = 0.0f, shiftY = 0.0f;
        if (psize[0] > psize[1])
        {
            scale = width / psize[0];
            shiftY = (height - psize[1] * scale) * 0.5f;
        }
        else
        {
            scale = height / psize[1];
            shiftX = (width - psize[0] * scale) * 0.5f;
        }
        animation->picture()->scale(scale);
        animation->picture()->translate(shiftX, shiftY);

        updated = true;
    }

private:
    explicit Renderer()
    {
        errorMsg = NoError;

        if (Initializer::init(CanvasEngine::Sw, 0) != Result::Success)
        {
            errorMsg = "init() fail";
            return;
        }

        canvas = SwCanvas::gen();
        if (!canvas)
            errorMsg = "Invalid canvas";

        animation = Animation::gen();
        if (!animation)
            errorMsg = "Invalid animation";
    }

private:
    string errorMsg;
    unique_ptr<SwCanvas> canvas = nullptr;
    unique_ptr<Animation> animation = nullptr;
    uint8_t *buffer = nullptr;
    uint32_t width = 0;
    uint32_t height = 0;
    float psize[2]; // picture size
    bool updated = false;
};

EMSCRIPTEN_BINDINGS(Renderer)
{
    class_<Renderer>("Renderer")
        .constructor(&Renderer::create)
        .function("error", &Renderer::error, allow_raw_pointers())
        .function("load", &Renderer::load)
        .function("update", &Renderer::update)
        .function("resize", &Renderer::resize)
        .function("render", &Renderer::render)
        .function("size", &Renderer::size)
        .function("duration", &Renderer::duration)
        .function("totalFrame", &Renderer::totalFrame)
        .function("frame", &Renderer::frame);
}